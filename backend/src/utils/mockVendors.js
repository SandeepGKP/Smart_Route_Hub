// Simulates a call to a third party vendor
const simulateVendorCall = async (vendor, payload) => {
    // Artificial latency based on vendor's configured timeout/metrics
    // For demo, we add random latency between 100ms and 1500ms
    const latency = Math.floor(Math.random() * 1400) + 100;
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random failure (e.g. 5% chance)
            const isFailure = Math.random() < 0.05;
            
            if (isFailure || vendor.metrics.isDown) {
                return reject(new Error(`${vendor.name} is down or request failed.`));
            }

            resolve({
                status: "SUCCESS",
                data: {
                    verified: true,
                    timestamp: new Date(),
                    vendorName: vendor.name,
                    mockedResponse: true
                }
            });
        }, latency);
    });
};

module.exports = { simulateVendorCall };
