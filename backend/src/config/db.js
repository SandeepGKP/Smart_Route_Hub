const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's Public DNS instead of the local Wi-Fi DNS.
// FIXME: This is a hack because my local router blocks MongoDB SRV records. Remove this in production!
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signzy_vendor_router');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
