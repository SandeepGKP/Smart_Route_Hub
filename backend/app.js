require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
// TODO: Hook this up to a proper monitoring tool (like Datadog) later
app.get('/health', (req, res) => {
    // console.log("[DEBUG] Health check pinged from load balancer");
    res.status(200).json({ status: 'Platform is healthy', timestamp: new Date() });
});

// Mount Routes
app.use('/vendors', require('./src/routes/vendorRoutes'));
app.use('/route', require('./src/routes/routeRoutes'));

// Explicit Mandatory APIs from assignment requirements
app.get('/vendor-metrics', require('./src/controllers/vendorController').getVendorMetrics);
app.get('/routing-logs', require('./src/controllers/routeController').getRoutingLogs);

// 404 handler
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
