const Attribute = require('../models/attributeModel');
const Organization = require('../models/organizationModel');

const updateRule = async (orgId, attributeId, rule) => {
    try {
        return await Organization.findOneAndUpdate(
            { _id: orgId, "attributes._id": attributeId },
            { $set: { "attributes.$.rule": rule } },
            { new: true }
        );
    } catch (err) {
        console.error('Error updating rule', err);
        throw err;
    }
}

const updatePriority = async (orgId, attributeId, priority) => {
    try {
        return await Organization.findOneAndUpdate(
            { _id: orgId, "attributes._id": attributeId },
            { $set: { "attributes.$.priority": priority } },
            { new: true }
        );
    } catch (err) {
        console.error('Error updating priority', err);
        throw err;
    }
}


module.exports = {
    updateRule,
    updatePriority,
}