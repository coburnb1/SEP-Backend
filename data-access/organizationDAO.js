const Organization = require('../models/organizationModel');
const mongoose = require("mongoose");

const getOrganizationsByOrganizer = async (organizerID) => {
    try{
        organizerID = new mongoose.Types.ObjectId(organizerID);
        return await Organization.find({ organizer_id: organizerID });
    }
    catch (err) {
        console.error('Error finding organizations by organizer', err);
        throw err;
    }
}

const getOrganizationByID = async (organizationID) => {
    try{
        const organization = await Organization.findById(organizationID);
        if (!organization) {
            throw new Error(`Organization with ID ${organizationID} not found.`);
        }
        return organization;
    } catch (err) {
        console.error('Error finding organization by ID', err);
        throw err;
    }
}

const removeByID = async (organizationID) => {
    try{
        return await Organization.findByIdAndDelete(organizationID);
    } catch (err) {
        console.error('Error deleting organization', err);
        throw err;
    }
}

const createOrg = async (organizationData) => {
    try{
        const organization = new Organization(organizationData);
        return await organization.save();
    } catch (err) {
        console.error('Error creating organization', err);
        throw err;
    }
}

module.exports = {
    getOrganizationsByOrganizer,
    getOrganizationByID,
    removeByID,
    createOrg,
}