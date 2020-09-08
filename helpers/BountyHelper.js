const axios = require('axios');
const vendorDefinitionManifest = require('../manifests/DestinyVendorDefinition.json');
const inventoryItemDefinitionManifest = require('../manifests/DestinyInventoryItemDefinition.json');
const objectiveDefinitionManifest = require('../manifests/DestinyObjectiveDefinition.json');
const towerVendors = {
    ZAVALA: 'Commander Zavala', 
    DRIFTER: 'The Drifter',
    BANSHEE: 'Banshee-44',
    SHAXX: 'Lord Shaxx',
    RECASTER: 'Prismatic Recaster',
    ERIS: 'Eris Morn',
    ASHER: 'Asher Mir',
    VANCE: 'Brother Vance',
    ANA: 'Ana Bray',
    FAILSAFE: 'Failsafe',
    SLOANE: 'Sloane',
    DEVRIM: 'Devrim Kay',
    SPIDER: 'Spider',
    //ADA: 'Ada-1'
};
const enemyTypes = {
    CABAL: 'Cabal',
    FALLEN: 'Fallen',
    HIVE: 'Hive',
    VEX: 'Vex',
    SCORN: 'Scorn',
    TAKEN: 'Taken'
}

const excludedLocationTerms = [enemyTypes.CABAL, enemyTypes.FALLEN, enemyTypes.HIVE, enemyTypes.VEX, enemyTypes.SCORN, enemyTypes.TAKEN, 'chests', 'sector'];
const vendorsArray = [towerVendors.ZAVALA, towerVendors.DRIFTER, towerVendors.BANSHEE, towerVendors.SHAXX, towerVendors.RECASTER,
towerVendors.ERIS, towerVendors.ASHER, towerVendors.VANCE, towerVendors.ANA, towerVendors.FAILSAFE, towerVendors.SLOANE, towerVendors.DEVRIM, towerVendors.SPIDER, towerVendors.ADA]
const weaponTypes = ['Auto', 'Pulse', 'Sidearm', 'Scout', 'Hand Cannon', 'Fusion', 'Bow', 'Sniper', 'Shotgun', 'Super',
    'Grenade', 'GrenadeLauncher', 'Finisher', 'Melee', 'Abilities', 'Rocket', 'Submachine', 'Machine'];
const locations = ['Crucible', 'Gambit Prime', 'Strikes', 'EDZ', 'Moon', 'IO', 'Mercury', 'Mars', 'Nessus', 'Titan', 'Tangled Shore'];
const elementTypes = ['Void', 'Solar', 'Arc'];
const ammoTypes = ['Primary', 'Special', 'Heavy']
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
            vendor.show = true;
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
                response = await axios(bountyRequest);
            }
            else {
                throw new Error(`Unable to get bounties: ${err.response.statusText}`, err.response.status);
            }
        }
        console.log('Grabbed bounties');
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
            if ((!bounty.time && !bounty.timeSelected) || bounty.time === 4) {
                bounty.timeSelected = Date.now();
                return bounty;
            }
            else if ((!bounty.time && bounty.timeSelected) || bounty.time === 4) {
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
        if ((!result || result.length === 0 || result[0].time === 4) && bounty) {
            bounty.time = time;
            let b = new Bounty({id, time});
            await b.save();
        }
    }

    async getAllBounties() {
        return Array.from(this._bounties.values())
    }

    async optimize(vendors, minScore = 0) {

        let globalBountyArray = [];
        let globalGroups = [];

        /*
            1. For each location, get bounties worth doing based on minscore
            2. Make a list of constraints for all bounties worth doing for each location
            3. Given these constraints, pick the highest scoring bounties that match constraints for this location
        */

        let vendorsToProcess = vendors.filter(v => vendorsArray.includes(v.name))
        let saleItems = [];
        for (let v of vendorsToProcess) {
            for (let item of v.saleItems) {
                item.vendorName = v.name;
            }
            saleItems.push(...v.saleItems);
        }
        let dailyBounties = saleItems.filter(bounty => bounty.bountyType.includes('Daily'));
        dailyBounties = this.analyzeConstraints(dailyBounties);
        this.scoreBounties(dailyBounties);
        console.log(dailyBounties.filter(b => b.vendorName === towerVendors.BANSHEE))
        dailyBounties = dailyBounties.filter(b => b.score >= minScore)
        if (dailyBounties.length > 0) {
            let sortedBounties = this.sortByScore(dailyBounties);
            for (let location of locations) {
                // First pull out all bounties for this location
                let bountiesForLocation = sortedBounties.filter(b => b.constraints.location.includes(location));
                if (bountiesForLocation.length > 0) {
                    sortedBounties = sortedBounties.filter(b => !bountiesForLocation.includes(b));
                    globalGroups.push({
                        location,
                        bounties: bountiesForLocation,
                        noBountyFound: 1
                    })
                }
            }
            if (globalGroups.length > 0) {
                this.buildBountyGraph(sortedBounties, globalGroups[0], 0, globalBountyArray, globalGroups);
            }
            else {
                globalGroups.push({
                    location: 'Any location',
                    bounties: sortedBounties
                })
            }
        }
        else {
            console.log('No bounties found that match the given score constraint');
        }
        return globalGroups;
    }

    buildBountyGraph(bounties, currentGroup, i, globalBountyArray, globalGroups) {
        if (bounties.length > 0) {
            console.log('Building bounty group for location:', currentGroup.location);           
            
            let groupConstraints = [];
            for (let bounty of currentGroup.bounties) {
                if (bounty.constraints.weaponType.length > 0) {
                    groupConstraints.push(...bounty.constraints.weaponType)
                }
                if (bounty.constraints.ammoType.length > 0) {
                    groupConstraints.push(...bounty.constraints.ammoType);
                }
                if (bounty.constraints.element.length > 0) {
                    groupConstraints.push(...bounty.constraints.element);
                }
            }

            // Now find the single bounty with the highest score & most matching constraints
            let mostCompatibleBounty = {
                numMatched: 0,
                score: 0,
            }

            for (let bounty of bounties) {
                let numMatched = 0;
                if (!bounty.constraints.excludedLocation.includes(currentGroup.location)) {
                    if (bounty.constraints.weaponType.length > 0) {
                        for (let weaponType of bounty.constraints.weaponType) {
                            if (groupConstraints.includes(weaponType)) {
                                numMatched++;
                            }
                        }
                    }
                    if (bounty.constraints.ammoType.length > 0) {
                        for (let ammoType of bounty.constraints.ammoType) {
                            if (groupConstraints.includes(ammoType)) {
                                numMatched++;
                            }
                        }
                    }
                    if (bounty.constraints.element.length > 0) {
                        for (let element of bounty.constraints.element) {
                            if (groupConstraints.includes(element)) {
                                numMatched++;
                            }
                        }
                    }
                    
                    if (numMatched > mostCompatibleBounty.numMatched) {
                        mostCompatibleBounty = {
                            numMatched,
                            score: bounty.score,
                            bounty
                        }
                    }
                }
            }

            if (mostCompatibleBounty.bounty) {
                currentGroup.bounties.push(mostCompatibleBounty.bounty);
                bounties = bounties.filter(b => b !== mostCompatibleBounty.bounty);
            }
            else {
                if (currentGroup.noBountyFound && currentGroup.noBountyFound <= 0 || bounties.length === 1) {
                    for (let group of globalGroups) {
                        group.noBountyFound++;
                    }
                    let bounty = bounties.filter(b => !b.constraints.excludedLocation.includes(currentGroup.location));
                    if (bounty.length > 0) {
                        currentGroup.bounties.push(bounty[0]);
                        bounties = bounties.filter(b => b !== bounty[0]);
                    }
                }
                else {
                    currentGroup.noBountyFound--;
                }
            }
            i++

            if (i >= globalGroups.length) {
                i = 0;
            }

            return this.buildBountyGraph(bounties, globalGroups[i], i, globalBountyArray, globalGroups);
        }
        else {
            return globalBountyArray;
        }
    }

    sortByScore(bounties) {
        if (bounties.length <= 1) { 
            return bounties;
        } 
        else {
            var left = [];
            var right = [];
            var newArray = [];
            var pivot = bounties.pop();
            var length = bounties.length;
    
            for (var i = 0; i < length; i++) {
                if (bounties[i].score > pivot.score) {
                    left.push(bounties[i]);
                } else {
                    right.push(bounties[i]);
                }
            }
            return newArray.concat(this.sortByScore(left), pivot, this.sortByScore(right));
        }
    }
    
    scoreBounties(bounties) {
        for (let bounty of bounties) {
            let constraints = bounty.constraints;
            let score = 0;

            // The sum of weights should be 100
            let weaponScoreWeight = 15;
            let locationScoreWeight = 25;
            let ammoScoreWeight = 15;
            let elementScoreWeight = 15;
            let timeWeight = 30;
            
            // Score weapon constraints
            let weaponScore;
            if (constraints.weaponType.length === 0) {
                weaponScore = 1;
            }
            else {
                weaponScore = (constraints.weaponType.length / weaponTypes.length);
            }
            score += (weaponScore * weaponScoreWeight);

            // Score location constraints
            let locationScore;
            if (constraints.location.length === 0) {
                locationScore = 1;
            }
            else {
                locationScore = (constraints.location.length / locations.length);
            }
            score += (locationScore * locationScoreWeight)
           
            // Score ammo constraints
            let ammoScore;
            if (constraints.ammoType.length === 0) {
                ammoScore = 1;
            }
            else {
                ammoScore = (constraints.ammoType.length / ammoTypes.length);
            }
            score += (ammoScore * ammoScoreWeight);

            // Score element constraints
            let elementScore;
            if (constraints.element.length === 0) {
                elementScore = 1;
            }
            else {
                elementScore = (constraints.element.length / elementTypes.length);
            }
            score += (elementScore * elementScoreWeight);

            switch (bounty.time) {
                case 1:
                    score += timeWeight;
                    break;
                case 2:
                    score += (timeWeight / 2);
                    break;
                case 3:
                    score += 0
                    break;
                default:
                    score += 0
            }
            bounty.score = score;
        }
    }

    /**
     * Find constraints on the given array of bounties
     * @param {Object[]} bounties The bounties to analyze
     * @returns {Object} An array of non location specific bounties and an array of "normal" bounties
     */
    analyzeConstraints(bounties) {
        let nonLocationSpecificBounties = [];
        let locationSpecificBounties = [];
        for (let bounty of bounties) {
            bounty.constraints = {
                weaponType: [],
                element: [],
                location: [],
                ammoType: [],
                excludedLocation: []
            };
            let knownBounty = this._bounties.get(bounty.itemHash.toString())
            if (knownBounty.time) {
                bounty.time = knownBounty.time;
            }
            else {
                console.log('No time value assigned to bounty:', bounty.itemHash);
                bounty.time = 4;
            }
            if (bounty.description.toUpperCase().includes('GRENADE') && bounty.description.toUpperCase().includes('LAUNCHER')) {
                // Special case for "grenade" vs "grenade launcher" - remove the space from "grenade launcher"
                let index = bounty.description.toUpperCase().indexOf('GRENADE');
                bounty.description = bounty.description.substring(0, index + 7) + bounty.description.substring(index + 8, bounty.description.length);
                console.log(bounty.description);
            }

            // Add weapon type constraints
            for (let weaponType of weaponTypes) {
                if (weaponType === 'Grenade' && bounty.description.toUpperCase().includes('GRENADELAUNCHER')) {
                    continue;
                }
                else if (bounty.description.toUpperCase().includes(weaponType.toUpperCase())) {
                    bounty.constraints.weaponType.push(weaponType);
                }
            }

            // Add location constraints
            switch (bounty.vendorName) {
                case(towerVendors.ZAVALA):
                    // Zavala
                    if (bounty.description.toUpperCase().includes('STRIKE') || bounty.description.toUpperCase().includes('NIGHTFALL')) {
                        bounty.constraints.location.push('Strikes');
                        locationSpecificBounties.push(bounty);
                    }
                    else {
                        bounty.constraints.excludedLocation = ['Crucible'];
                    }
                    break;
                case(towerVendors.DRIFTER):
                    // Drifter
                    bounty.constraints.location.push('Gambit Prime');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.SHAXX):
                    // Shaxx
                    bounty.constraints.location.push('Crucible');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.ERIS):
                    bounty.constraints.location.push('Moon');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.DEVRIM):
                    bounty.constraints.location.push('EDZ');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.FAILSAFE):
                    bounty.constraints.location.push('Nessus');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.SLOANE):
                    bounty.constraints.location.push('Titan');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.VANCE):
                    bounty.constraints.location.push('Mercury');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.ANA):
                    bounty.constraints.location.push('Mars');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.ASHER):
                    bounty.constraints.location.push('IO');
                    locationSpecificBounties.push(bounty);
                    break;
                case(towerVendors.SPIDER):
                    bounty.constraints.location.push('Tangled Shore');
                    locationSpecificBounties.push(bounty);
                    break;
                default:
                    // Bounty has no location constraints
                    nonLocationSpecificBounties.push(bounty);
                    break;
            }

            // Add elemental constraints
            for (let element of elementTypes) {
                if (bounty.description.toUpperCase().includes(element.toUpperCase())) {
                    bounty.constraints.element.push(element);
                }
            }

            // Add ammo type constraints
            for (let ammoyType of ammoTypes) {
                if (bounty.description.toUpperCase().includes(ammoyType.toUpperCase())) {
                    bounty.constraints.ammoType.push(ammoyType);
                }
            }

            // Check for enemy type
            for (let term of excludedLocationTerms) {
                if (bounty.description.toUpperCase().includes(term.toUpperCase())) {
                    bounty.constraints.excludedLocation = ['Crucible', 'Gambit', 'Gambit Prime'];
                    switch(term) {
                        case enemyTypes.CABAL:
                            bounty.constraints.excludedLocation.push(...['Moon']);
                            break;
                        case enemyTypes.FALLEN:
                            bounty.constraints.excludedLocation.push(...['Mercury', 'Mars', 'IO']);
                            break;
                        case enemyTypes.HIVE:
                            bounty.constraints.excludedLocation.push(...['EDZ'])
                            break;
                        case enemyTypes.SCORN:
                            bounty.constraints.excludedLocation.push(...['EDZ', 'Moon', 'Nessus', 'IO', 'Titan', 'Mercury',
                        'Mars', 'Moon']);
                            break;
                        case 'sector':
                            bounty.constraints.excludedLocation.push('Strikes');
                            break;
                        case enemyTypes.VEX:
                            bounty.constraints.excludedLocation.push(...['EDZ', 'Moon']);
                    }
                }
            }
        }
        return bounties;
    }
}

module.exports = BountyHelper;
