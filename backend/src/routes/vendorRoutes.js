const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

const aiController = require('../controllers/aiController');

router.post('/', vendorController.createVendor);
router.get('/', vendorController.getVendors);
router.get('/metrics', vendorController.getVendorMetrics);
router.post('/ai/suggest-routing', aiController.suggestRoutingConfig);

module.exports = router;
