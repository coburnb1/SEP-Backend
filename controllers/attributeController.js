const attributeService = require('../services/attributeService');

const updateRule = async (req, res) => {
    try{
        const { orgId, attrId } = req.params;
        const { rule } = req.body;
        const attribute = await attributeService.updateRule(orgId, attrId, rule);
        res.status(200).json(attribute);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updatePriority = async (req, res) => {
    try{
        const { orgId, attrId } = req.params;
        const { priority } = req.body;
        const attribute = await attributeService.updatePriority(orgId, attrId, priority);
        res.status(200).json(attribute);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    updateRule,
    updatePriority,
}