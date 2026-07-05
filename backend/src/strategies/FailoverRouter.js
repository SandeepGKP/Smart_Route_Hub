const RouterStrategy = require('./RouterStrategy');

class FailoverRouter extends RouterStrategy {
    selectVendor(vendors, requirements) {
        const availableVendors = vendors.filter(v => !v.metrics.isDown);
        if (availableVendors.length === 0) return null;

        // Sort by priority (lower number = higher priority)
        availableVendors.sort((a, b) => (a.priority || 99) - (b.priority || 99));
        return availableVendors[0]; // Returns the highest priority available vendor
    }
}
module.exports = FailoverRouter;
