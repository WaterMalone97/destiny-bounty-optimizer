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
                    icon: `https://bungie.net${manifestItem.displayProperties.icon}`
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

    getUnevaluatedBounty() {
        for (let bounty of Array.from(this._bounties.values())) {
            if (!bounty.time) {
                return bounty;
            }
        }
    }

    async addBountyEvaluation(id, time) {
        let bounty = this._bounties.get(id);
        if (bounty) {
            bounty.time = time;
            let b = new Bounty({id, time});
            await b.save();
        }
    }
}

module.exports = BountyHelper;
