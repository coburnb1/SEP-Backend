const Attribute = require('../models/attributeModel');

const updateRule = async (attributeId, rule) => {
    try{
        return await Attribute.findByIdAndUpdate(
            attributeId,
            { $set: { rule: rule } },
            { new: true }
        );
    } catch (err) {
        console.error('Error updating rule', err);
        throw err;
    }
}

const updatePriority = async (attributeId, priority) => {
    try{
        return await Attribute.findByIdAndUpdate(
            attributeId,
            { $set: { priority: priority } },
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