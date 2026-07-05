const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    capability: {
        type: String,
        required: true,
        index: true // e.g., 'PAN_VERIFICATION', 'OCR'
    },
    name: {
        type: String,
        required: true, // e.g., 'VendorA'
    },
    weight: {
        type: Number,
        default: 10 // For weighted routing
    },
    costPerRequest: {
        type: Number,
        required: true // For lowest cost routing
    },
    timeoutMs: {
        type: Number,
        default: 2000
    },
    rateLimitPerMinute: {
        type: Number,
        default: 100
    },
    priority: {
        type: Number,
        default: 1 // Lower number = higher priority for failover routing
    },
    supportedFeatures: {
        type: [String],
        default: [] // e.g. ['FACE_MATCH', 'OCR']
    },
    // Live metrics tracking for health-based routing
    metrics: {
        averageLatencyMs: { type: Number, default: 0 },
        successRate: { type: Number, default: 100 },
        totalRequests: { type: Number, default: 0 },
        failedRequests: { type: Number, default: 0 },
        isDown: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
