const respondentDAO = require('../data-access/respondentDAO');

const getAllRespondents = async (organizationID) => {
    try {
        return await respondentDAO.getRespondentsByOrganization(organizationID);
    } catch (err) {
        console.error('Error getting respondents:', err);
        throw err;
    }
}

const getRespondent = async (respondentID) => {
    try{
        return await respondentDAO.getRespondentByID(respondentID);
    }
    catch(err){
        console.error('Error getting respondent:', err);
        throw err;
    }
}

const submitRespondent = async (respondentData) => {
    try{
        return await respondentDAO.createRespondent(respondentData);
    }
    catch(err){
        console.error('Error creating respondent:', err);
        throw err;
    }
}

const setGroupLeader = async (respondentID) => {
    try{
        return await respondentDAO.setGroupLeader(respondentID);
    }
    catch(err){
        console.error('Error setting respondent as group leader:', err);
        throw err;
    }
}

const setGroupNumber = async (respondentID, groupNumber) => {
    try{
        return await respondentDAO.setGroupNumberTo(respondentID, groupNumber)
    }
    catch(err){

    }
}

const remove = async (respondentID) => {
    try{
        return await respondentDAO.removeByID(respondentID);
    }
    catch(err){
        console.error('Error removing respondent:', err);
        throw err;
    }
}

module.exports = {
    getAllRespondents,
    getRespondent,
    submitRespondent,
    setGroupLeader,
    setGroupNumber,
    remove,
}
