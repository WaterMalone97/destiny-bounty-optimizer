let manifest = require('../client/src/DestinyVendorDefinition.json')

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
            vendor.name = manifest[vendor.id].displayProperties.name;
        }
    }
}

module.exports = BountyHelper;
