const RouterStrategy = require('./RouterStrategy');

class LowestLatencyRouter extends RouterStrategy {
    selectVendor(vendors, requirements) {
        const availableVendors = vendors.filter(v => !v.metrics.isDown);
        if (availableVendors.length === 0) return null;

        // Temporary solution for the cold start problem - assigning 0 latency to new vendors
        // TODO: investigate if a random exploration strategy would be more balanced long-term
        const getLatency = (v) => v.metrics.totalRequests === 0 ? 0 : v.metrics.averageLatencyMs;
        availableVendors.sort((a, b) => getLatency(a) - getLatency(b));
        
        // Check if there is a maxLatencyMs requirement
        if (requirements && requirements.maxLatencyMs) {
            const qualifyingVendors = availableVendors.filter(v => getLatency(v) <= requirements.maxLatencyMs);
            if (qualifyingVendors.length > 0) return qualifyingVendors[0];
        }

        return availableVendors[0];
    }
}
module.exports = LowestLatencyRouter;
