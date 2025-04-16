const organizerService = require('../services/organizerService');

const retrieve = async (req, res) => {
    try {
        const organizer = await organizerService.getOrganizer(req.body.email, req.body.password);
        res.status(200).json(organizer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const register = async (req, res) => {
    try {
        const organizer = await organizerService.registerOrganizer(req.body);
        res.status(200).json(organizer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const organizer = await organizerService.updateOrganizer(req.params.id, req.body);
        res.status(200).json(organizer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    retrieve,
    register,
    update,
};