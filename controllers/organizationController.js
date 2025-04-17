const organizationService = require('../services/organizationService');

const retrieveAll = async (req, res) => {
    try{
        const organizations = await organizationService.getAllOrgs(req.params.id);
        res.status(200).json(organizations);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const retrieve = async (req, res) => {
    try{
        const organization = await organizationService.getOrg(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const remove = async (req, res) => {
    try{
        const organization = await organizationService.deleteOrg(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const create = async (req, res) => {
    try{
        const organization = await organizationService.addOrg(req.body);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getGroups = async (req, res) => {
    try{
        const organization = await organizationService.groupingAlgorithm(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const groupsAvailability = async (req, res) => {
    try{
        const organization = await organizationService.getGroupsAvailability(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const exportToCsv = async (req, res) => {
    try{
        const organization = await organizationService.exportGroupsToCSV(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    retrieveAll,
    retrieve,
    remove,
    create,
    getGroups,
    groupsAvailability,
    exportToCsv,
}