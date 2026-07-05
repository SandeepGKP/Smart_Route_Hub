const LowestCostRouter = require('../strategies/LowestCostRouter');
const WeightedRouter = require('../strategies/WeightedRouter');
const FailoverRouter = require('../strategies/FailoverRouter');
const LowestLatencyRouter = require('../strategies/LowestLatencyRouter');
const Vendor = require('../models/Vendor');

class RoutingEngine {
    constructor() {
        this.strategies = {
            'lowest_cost': new LowestCostRouter(),
            'weighted': new WeightedRouter(),
            'failover': new FailoverRouter(),
            'lowest_latency': new LowestLatencyRouter()
        };
    }

    async getBestVendor(capability, strategyName, requirements = {}) {
        // Find all vendors for this capability
        let vendors = await Vendor.find({ capability });
        
        if (!vendors || vendors.length === 0) {
            throw new Error(`No vendors found for capability: ${capability}`);
        }

        // 1. Filter out vendors that have exceeded their rate limit 
        // (Simplified: assuming totalRequests in the last minute, though strictly we'd need a time-window)
        // For this assignment, we'll simulate rate limit blocking if totalRequests > rateLimitPerMinute
        // and we'll filter based on required features.
        vendors = vendors.filter(v => {
            // Check features if requested
            if (requirements.requiredFeatures && requirements.requiredFeatures.length > 0) {
                const hasFeatures = requirements.requiredFeatures.every(f => v.supportedFeatures.includes(f));
                if (!hasFeatures) return false;
            }
            
            // Global Latency Threshold Check
            if (requirements.maxLatencyMs && v.metrics.averageLatencyMs > requirements.maxLatencyMs) {
                return false;
            }
            
            // Basic simulated rate limit check
            // (If they exceed their configured rate limit threshold)
            if (v.rateLimitPerMinute && v.metrics.totalRequests >= v.rateLimitPerMinute) { 
               return false; // Skip this vendor, rate limit reached
            }
            return true;
        });

        if (vendors.length === 0) {
             throw new Error(`No vendors meet the feature or rate limit requirements for ${capability}`);
        }

        let strategy = this.strategies[strategyName];
        
        // Default to failover if strategy not found
        if (!strategy) {
            console.warn(`Strategy ${strategyName} not found, defaulting to failover`);
            strategy = this.strategies['failover'];
        }

        // Apply strategy
        const selectedVendor = strategy.selectVendor(vendors, requirements);
        
        if (!selectedVendor) {
            throw new Error(`All vendors for capability ${capability} are currently unavailable.`);
        }

        return selectedVendor;
    }
}

module.exports = new RoutingEngine();
