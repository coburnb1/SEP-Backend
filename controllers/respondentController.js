const respondentService = require('../services/respondentService');

const retrieveAll = async (req, res) => {
    try {
        const organizationID = req.params.id;
        const respondents = await respondentService.getAllRespondents(organizationID);
        res.status(200).json(respondents);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const retrieve = async (req, res) => {
    try {
        const respondentID = req.params.id;
        const respondent = await respondentService.getRespondent(respondentID);
        res.status(200).json(respondent);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const submit = async (req, res) => {
    try {
        const respondent = await respondentService.submitRespondent(req.body)
        res.status(200).json(respondent);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const setGroupLeader = async (req, res) => {
    try {
        const respondentID = req.params.id;
        const respondent = await respondentService.setGroupLeader(respondentID);
        res.status(200).json(respondent);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const setGroupNumber = async (req, res) => {
    try {
        const respondentID = req.params.id;
        const respondent = await respondentService.setGroupNumber(respondentID, req.body.groupNumber);
        res.status(200).json(respondent);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const remove = async (req, res) => {
    try{
        const respondentID = req.params.id;
        const respondent = await respondentService.remove(respondentID);
        res.status(200).json(respondent);
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    retrieveAll,
    retrieve,
    submit,
    setGroupLeader,
    setGroupNumber,
    remove,
};