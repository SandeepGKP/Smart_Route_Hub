const RouterStrategy = require('./RouterStrategy');

class WeightedRouter extends RouterStrategy {
    selectVendor(vendors, requirements) {
        const availableVendors = vendors.filter(v => !v.metrics.isDown);
        if (availableVendors.length === 0) return null;

        const totalWeight = availableVendors.reduce((sum, v) => sum + (v.weight || 1), 0);
        let randomNum = Math.random() * totalWeight;

        for (const vendor of availableVendors) {
            randomNum -= (vendor.weight || 1);
            if (randomNum <= 0) {
                return vendor;
            }
        }
        return availableVendors[availableVendors.length - 1];
    }
}
module.exports = WeightedRouter;
