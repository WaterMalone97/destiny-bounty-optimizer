const vendorDefinitionManifest = require('../manifests/DestinyVendorDefinition.json');
const inventoryItemDefinitionManifest = require('../manifests/DestinyInventoryItemDefinition.json');
const objectiveDefinitionManifest = require('../manifests/DestinyObjectiveDefinition.json');

class BountyHelper {
    constructor(ctx) {
        this._ctx = ctx;
    }

    /**
     * Search the manifest for the vendor name
     * @param {Object[]} vendors An array of vendors
     */
    getVendorNames(vendors) {
        for (let vendor of vendors) {
            vendor.name = vendorDefinitionManifest[vendor.id].displayProperties.name;
            vendor.icon = `bungie.net${vendorDefinitionManifest[vendor.id].displayProperties.largeIcon}`;
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
                    item.icon = `bungie.net${manifestItem.displayProperties.icon}`;
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
}

module.exports = BountyHelper;
