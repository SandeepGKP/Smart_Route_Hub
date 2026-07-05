const RouterStrategy = require('./RouterStrategy');

class LowestCostRouter extends RouterStrategy {
    selectVendor(vendors, requirements) {
        // Filter out down vendors
        const availableVendors = vendors.filter(v => !v.metrics.isDown);
        if (availableVendors.length === 0) return null;

        // Sort by cost ascending
        availableVendors.sort((a, b) => a.costPerRequest - b.costPerRequest);
        return availableVendors[0];
    }
}
module.exports = LowestCostRouter;
