const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/', routeController.routeRequest);
router.get('/logs', routeController.getRoutingLogs);

module.exports = router;
