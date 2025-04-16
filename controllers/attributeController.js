const atrributeService = require('../../services/atrributeService');
const attributeService = require("./attributeController");

const updateRule = async (req, res) => {
    try{
        const attribute = await attributeService.updateRule(req.params.id, req.body);
        res.status(200).json(attribute);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updatePriority = async (req, res) => {
    try{
        const attribute = await attributeService.updatePriority(req.params.id, req.body);
        res.status(200).json(attribute);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    updateRule,
    updatePriority,
}