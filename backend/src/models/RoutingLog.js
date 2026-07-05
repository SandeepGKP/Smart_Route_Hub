const mongoose = require('mongoose');

const routingLogSchema = new mongoose.Schema({
    capability: { type: String, required: true },
    vendorUsed: { type: String, required: true },
    routingStrategy: { type: String, required: true },
    routingReason: { type: String },
    latencyMs: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    requestPayload: { type: mongoose.Schema.Types.Mixed },
    responsePayload: { type: mongoose.Schema.Types.Mixed },
    errorMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RoutingLog', routingLogSchema);
