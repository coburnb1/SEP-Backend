const organizationService = require('../../services/organizationService');

const allOrgs = async (req, res) => {
    try{
        const organizations = await organizationService.getAllOrgs();
        res.status(200).json(organizations);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const specificOrg = async (req, res) => {
    try{
        const organization = await organizationService.getOrg(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteOrg = async (req, res) => {
    try{
        const organization = await organizationService.deleteOrg(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const addOrg = async (req, res) => {
    try{
        const organization = await organizationService.addOrg(req.body);
        res.status(200).json(organization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    allOrgs,
    specificOrg,
    deleteOrg,
    addOrg,
}