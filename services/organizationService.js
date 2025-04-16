const organizationDAO = require('../data-access/organizationDAO');

const getAllOrgs = async () => {
    try{
        return await organizationDAO.getAllOrganizations();
    }catch(err){
       console.error('Error finding organizations', err);
       throw err;
    }
}

const getOrg = async(organizationId) => {
    try{
        return await organizationDAO.getOrganization(organizationId);
    } catch(err){
        console.error('Error finding organization', err);
        throw err;
    }
}

const deleteOrg = async(organizationId) => {
    try{
        return await organizationDAO.deleteOrganization(organizationId);
    } catch(err){
        console.error('Error deleting organization', err);
        throw err;
    }
}

const addOrg = async(orgData) => {
    try{
        return await organizationDAO.addOrganization(orgData);
    } catch(err){
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