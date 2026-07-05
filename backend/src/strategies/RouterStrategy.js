class RouterStrategy {
    /**
     * @param {Array} vendors - List of available vendors for a capability
     * @param {Object} requirements - Request specific requirements
     * @returns {Object} - The selected vendor
     */
    selectVendor(vendors, requirements) {
        throw new Error("selectVendor method must be implemented");
    }
}
module.exports = RouterStrategy;
