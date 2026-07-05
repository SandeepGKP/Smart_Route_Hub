const RoutingEngine = require('../services/RoutingEngine');
const RoutingLog = require('../models/RoutingLog');
const { simulateVendorCall } = require('../utils/mockVendors');

exports.routeRequest = async (req, res) => {
    const { capability, payload, strategy, requirements } = req.body;
    
    if (!capability) {
        return res.status(400).json({ error: "capability is required." });
    }

    // Infer strategy from requirements if missing (to match Sample Input perfectly)
    let activeStrategy = strategy;
    if (!activeStrategy) {
        if (requirements && requirements.preferLowCost) {
            activeStrategy = 'lowest_cost';
        } else {
            activeStrategy = 'failover'; // Default fallback
        }
    }

    const startTime = Date.now();
    let selectedVendor;

    try {
        // TODO: Move this vendor fetching to a Redis cache if we start getting crazy traffic next month
        // 1. Get the best vendor using our Routing Engine
        selectedVendor = await RoutingEngine.getBestVendor(capability, activeStrategy, requirements);
        
        // 2. Simulate the actual call to the vendor
        console.log("Routing traffic to vendor:", selectedVendor.name);
        const vendorResponse = await simulateVendorCall(selectedVendor, payload);
        const latencyMs = Date.now() - startTime;

        // 3. Log the successful routing
        const log = new RoutingLog({
            capability,
            vendorUsed: selectedVendor.name,
            routingStrategy: strategy,
            routingReason: `Selected based on ${strategy} strategy`,
            latencyMs,
            cost: selectedVendor.costPerRequest,
            status: 'SUCCESS',
            requestPayload: payload,
            responsePayload: vendorResponse
        });
        await log.save();

        // 4. Update vendor metrics (success)
        selectedVendor.metrics.totalRequests += 1;
        // Moving average formula: (oldAvg * (count-1) + newval) / count
        const prevAvg = selectedVendor.metrics.averageLatencyMs || latencyMs;
        const count = selectedVendor.metrics.totalRequests;
        selectedVendor.metrics.averageLatencyMs = ((prevAvg * (count - 1)) + latencyMs) / count;
        selectedVendor.metrics.successRate = ((count - selectedVendor.metrics.failedRequests) / count) * 100;
        await selectedVendor.save();

        // 5. Standardized response
        return res.status(200).json({
            status: "SUCCESS",
            vendorUsed: selectedVendor.name,
            routingReason: `Selected based on ${strategy} strategy`,
            latencyMs,
            cost: selectedVendor.costPerRequest,
            response: vendorResponse.data
        });

    } catch (error) {
        const latencyMs = Date.now() - startTime;
        
        // Log the failure
        if (selectedVendor) {
            const log = new RoutingLog({
                capability,
                vendorUsed: selectedVendor.name,
                routingStrategy: strategy,
                latencyMs,
                cost: selectedVendor.costPerRequest,
                status: 'FAILED',
                requestPayload: payload,
                errorMessage: error.message
            });
            await log.save();

            // Update vendor metrics (failure)
            selectedVendor.metrics.totalRequests += 1;
            selectedVendor.metrics.failedRequests += 1;
            const count = selectedVendor.metrics.totalRequests;
            selectedVendor.metrics.successRate = ((count - selectedVendor.metrics.failedRequests) / count) * 100;
            
            // Basic circuit breaker: mark down if success rate < 50% after 5 requests
            if (count > 5 && selectedVendor.metrics.successRate < 50) {
                selectedVendor.metrics.isDown = true;
            }
            await selectedVendor.save();
        }

        return res.status(500).json({
            status: "FAILED",
            vendorUsed: selectedVendor ? selectedVendor.name : 'NONE',
            error: error.message
        });
    }
};

exports.getRoutingLogs = async (req, res) => {
    try {
        const logs = await RoutingLog.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
