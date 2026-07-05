const Vendor = require('../models/Vendor');

exports.createVendor = async (req, res) => {
    try {
        // Handle "Example Routing Rules" format (Bulk insert)
        if (req.body.vendors && Array.isArray(req.body.vendors)) {
            const capability = req.body.capability;
            const vendorsToInsert = req.body.vendors.map(v => ({
                ...v,
                capability: v.capability || capability // Inherit capability from parent
            }));
            const insertedVendors = await Vendor.insertMany(vendorsToInsert);
            return res.status(201).json({ message: "Vendors configured successfully", vendors: insertedVendors });
        }
        
        // Handle single vendor insert (Fallback/UI)
        const vendor = new Vendor(req.body);
        await vendor.save();
        console.log(`[DEBUG] Successfully inserted vendor: ${vendor.name}`);
        res.status(201).json(vendor);
    } catch (error) {
        console.error(`[ERROR] Failed to insert vendor:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVendorMetrics = async (req, res) => {
    try {
        const vendors = await Vendor.find({}, 'name capability metrics');
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
