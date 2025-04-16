const attributeDAO = require('../data-access/attributeDAO');

const updateRule = async (attributeId, rule) => {
    try{
        return await attributeDAO.updateRule(attributeId, rule)
    } catch(err){
        console.error(err);
        throw err;
    }
}

const updatePriority = async (attributeId, priority) => {
    try{
        return await attributeDAO.updatePriority(attributeId, priority)
    } catch(err){
        console.error(err);
        throw err;
    }
}

module.exports = {
    updateRule,
    updatePriority,
}