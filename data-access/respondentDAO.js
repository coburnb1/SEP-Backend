const Respondent = require('../models/respondentModel');
const mongoose = require("mongoose");

const getRespondentsByOrganization = async (organizationID) => {
    try {
        organizationID = new mongoose.Types.ObjectId(organizationID);
        return await Respondent.find({ organizationID: organizationID });
    } catch (err) {
        console.error('Error fetching respondents by organization:', err);
        throw err;
    }
}

const getRespondentByID = async (respondentID) => {
    try {
        return await Respondent.findById(respondentID);
    } catch (err) {
        console.error('Error fetching respondent by ID:', err);
        throw err;
    }
}

const createRespondent = async (respondentData) => {
    try {
        const newRespondent = new Respondent(respondentData);
        return await newRespondent.save();
    } catch (err) {
        console.error('Error creating respondent:', err);
        throw err;
    }
}

const setGroupLeader = async (respondentID) => {
    try {
        return await Respondent.findByIdAndUpdate(
            respondentID,
            { $bit: { is_group_leader: { xor: 1 } } }, //simply flip the current bool value
            { new: true }
        );
    } catch (err) {
        console.error('Error flipping group leader status:', err);
        throw err;
    }
}

const setGroupNumberTo = async (respondentID, groupNumber) => {
    try {
        return await Respondent.findByIdAndUpdate(
            respondentID,
            { $set: { group_number: groupNumber } },
            { new: true }
        );
    } catch (err) {
        console.error('Error setting group number:', err);
        throw err;
    }
}

const removeByID = async (respondentID) => {
    try {
        return await Respondent.findByIdAndDelete(respondentID);
    } catch (err) {
        console.error('Error removing respondent by ID:', err);
        throw err;
    }
}

module.exports = {
    getRespondentsByOrganization,
    getRespondentByID,
    createRespondent,
    setGroupLeader,
    setGroupNumberTo,
    removeByID,
}