const Organization = require('../models/organizationModel');

const getAllOrgs = async () => {
    try{
        return await Organization.find();
    } catch (err) {
        console.error('Error finding organizations', err);
        throw err;
    }
}

const getOrg = async (organizationId) => {
    try{
        return await Organization.findById(organizationId);
    } catch (err) {
        console.error('Error finding organization', err);
        throw err;
    }
}

const deleteOrg = async (organizationId) => {
    try{
        return await Organization.findByIdAndDelete(organizationId);
    } catch (err) {
        console.error('Error deleting organization', err);
        throw err;
    }
}

const addOrg = async (organizationData) => {
    try{
        const organization = new Organization(organizationData);
        return await organization.save();
    } catch (err) {
        console.error('Error adding organization', err);
        throw err;
    }
}

module.exports = {
    getAllOrgs,
    getOrg,
    deleteOrg,
    addOrg,
}