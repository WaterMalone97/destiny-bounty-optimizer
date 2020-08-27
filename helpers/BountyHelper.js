const axios = require('axios');
const vendorDefinitionManifest = require('../manifests/DestinyVendorDefinition.json');
const inventoryItemDefinitionManifest = require('../manifests/DestinyInventoryItemDefinition.json');
const objectiveDefinitionManifest = require('../manifests/DestinyObjectiveDefinition.json');
const Bounty = require('../models/Bounty');

class BountyHelper {
    constructor(ctx) {
        this._ctx = ctx;
        this._bounties = new Map();
        Object.keys(inventoryItemDefinitionManifest).filter(item => {
            let manifestItem = inventoryItemDefinitionManifest[item];
            if (manifestItem.itemTypeAndTierDisplayName && manifestItem.itemTypeAndTierDisplayName.includes('Bounty') && !manifestItem.itemTypeAndTierDisplayName.includes('Weekly Bounty')) {
                let objectiveIds = Object.keys(manifestItem.objectives.objectiveHashes).map(id => {
                    return manifestItem.objectives.objectiveHashes[id];
                });
                let completionValue = objectiveDefinitionManifest[objectiveIds[0]].completionValue

                this._bounties.set(item, {
                    id: item,
                    itemTypeDisplayName: manifestItem.itemTypeDisplayName,
                    description: manifestItem.displayProperties.description,
                    completionValue,
                    icon: `https://bungie.net${manifestItem.displayProperties.icon}`,
                    progressDescription: objectiveDefinitionManifest[objectiveIds[0]].progressDescription
                });
            }
            else {
                return false;
            }
        });
        Bounty.find({id: {$in : Array.from(this._bounties.keys())}})
        .then(currentlyRanked => {
            for (let rank of currentlyRanked) {
                let bounty = this._bounties.get(rank.id)
                bounty.time = rank.time;
            }
        });
    }

    /**
     * Search the manifest for the vendor name
     * @param {Object[]} vendors An array of vendors
     */
    getVendorNames(vendors) {
        for (let vendor of vendors) {
            vendor.name = vendorDefinitionManifest[vendor.id].displayProperties.name;
            vendor.icon = `https://bungie.net${vendorDefinitionManifest[vendor.id].displayProperties.largeIcon}`;
        }
    }

    /**
     * Get the required information about bounties that the passed in vendors are selling
     * @param {Object[]} vendors An array of vendors
     */
    getBountyInfo(vendors) {
        let vendorsToDelete = [];
        for (let vendor of vendors) {
            let itemsToDelete = [];
            for (let item of vendor.saleItems) {
                let manifestItem = inventoryItemDefinitionManifest[item.itemHash];
                item.bountyType = manifestItem.itemTypeAndTierDisplayName;
                if (item.bountyType.includes('Bounty')) {
                    let objectiveIds = Object.keys(manifestItem.objectives.objectiveHashes).map(id => {
                        return manifestItem.objectives.objectiveHashes[id];
                    });
                    let objectives = objectiveIds.map(id => {
                        return {
                            id,
                            completionValue: objectiveDefinitionManifest[id].completionValue,
                            progressDescription: objectiveDefinitionManifest[id].progressDescription
                        };
                    });
                    item.description = manifestItem.displayProperties.description;
                    item.name = manifestItem.displayProperties.name;
                    item.icon = `https://bungie.net${manifestItem.displayProperties.icon}`;
                    item.objectives = objectives;
                }
                else {
                    // Bounty is not a daily or weekly. Delete it.
                    itemsToDelete.push(item);
                }
            }
            for (let item of itemsToDelete) {
                vendor.saleItems.splice(vendor.saleItems.indexOf(item), 1);
            }
            if (vendor.saleItems.length === 0 || !vendor.saleItems) {
                vendorsToDelete.push(vendor);
            }
        }
        for (let vendor of vendorsToDelete) {
            vendors.splice(vendors.indexOf(vendor), 1);
        }
    }

    /**
     * Makes a call to the destiny API to get vendor sales
     * @return {Object[]} An array of formatted bounty objects
     */
    async getBounties() {
        let response;
        try {
            let token = await this._ctx.tokenHelper.grabToken();
            let bountyRequest = {
                url: `https://www.bungie.net/Platform/Destiny2/${process.env.mem_type}/Profile/${process.env.member_id}/Character/${process.env.char_id}/Vendors/`,
                method: 'GET',
                headers: {
                    'X-API-Key': process.env.apiKey, 
                    'Authorization': 'Bearer ' + token
                },
                params: {
                    // Specifies the type of data bungie should give, in this case, 402 specifies vendor sales
                    components: 402
                }
            }
            response = await axios(bountyRequest);
        }
        catch (err) {
            if (err.response.status == 401) {
                console.log('Token expired, refreshing token')
                await this._ctx.tokenHelper.refreshToken();
                await getBounties();
            }
            else {
                throw new Error('Unable to get bounties', err.response.status);
            }
        }
        console.log('Grabbed bounties');
        //let vendorSales = Object.entries(response.data.Response.sales.data).map((sale) => ( { [sale[0]]: sale[1] } ));
        let vendorSales = [];
        Object.keys(response.data.Response.sales.data).map(key => {
            let saleItems = [];
            Object.keys(response.data.Response.sales.data[key].saleItems).map(item => {
                saleItems.push({
                    id: item,
                    ...response.data.Response.sales.data[key].saleItems[item],
                    toggle: false,
                    show: false
                });
            });
            vendorSales.push({
                id: key,
                saleItems
            });
        });
        this._ctx.bountyHelper.getVendorNames(vendorSales);
        this._ctx.bountyHelper.getBountyInfo(vendorSales);
        return vendorSales;
    }

    /**
     * Find a bounty that doesn't have a time set
     * @returns {Object} A bounty object
     */
    getUnevaluatedBounty() {
        for (let bounty of Array.from(this._bounties.values())) {
            if (!bounty.time && !bounty.timeSelected) {
                bounty.timeSelected = Date.now();
                return bounty;
            }
            else if (!bounty.time && bounty.timeSelected) {
                let currentTime = Date.now();
                if (currentTime > bounty.timeSelected + 30000) {
                    bounty.timeSelected = Date.now();
                    return bounty;
                }
            }
        }
    }

    /**
     * Insert the time value into the DB for the specified bounty
     * @param {String} id The id of the bounty
     * @param {String} time The time value
     */
    async addBountyEvaluation(id, time) {
        let bounty = this._bounties.get(id);
        let result = await Bounty.find( {id} );
        if (!result || result.length === 0 && bounty) {
            bounty.time = time;
            let b = new Bounty({id, time});
            await b.save();
        }
    }
}

module.exports = BountyHelper;
