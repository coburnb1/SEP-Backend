const attributeDAO = require('../data-access/attributeDAO');

const updateRule = async (OrgId, attributeId, rule) => {
    const validRules = [
        "Like To Like",
        "Like Away From Like",
        "Balance Like With Like"
    ];

    if (!validRules.includes(rule)) {
        throw new Error(
            `Invalid rule option. Must be one of: ${validRules.join(", ")}`
        );
    }

    try {
        return await attributeDAO.updateRule(OrgId, attributeId, rule);
    } catch (err) {
        console.error(err);
        throw err;
    }
}


const updatePriority = async (OrgId, attributeId, newPriority) => {
    try{
        return await attributeDAO.updatePriority(OrgId, attributeId, newPriority)
    } catch(err){
        console.error(err);
        throw err;
    }
}

module.exports = {
    updateRule,
    updatePriority,
}