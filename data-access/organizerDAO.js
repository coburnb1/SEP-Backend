const Organizer = require('../models/organizerModel');

const getOrganizerByEmailAndPassword = async (email, password) => {
    try {
        return await Organizer.findOne({ email, password });
    } catch (err) {
        console.error('Error finding organizer:', err);
        throw err;
    }
};

const createOrganizer = async (OrganizerData) => {
    try {
        const organizer = new Organizer(OrganizerData);
        return await organizer.save();
    }
    catch (err) {
        console.error('Error creating organizer:', err);
        throw err;
    }
};

const updateOrganizer = async (organizerID, updatedData) => {
    try {
        return await Organizer.findByIdAndUpdate(organizerID, updatedData, { new: true });
    }
    catch (err) {
        console.error('Error updating organizer:', err);
        throw err;
    }
}

module.exports = {
    getOrganizerByEmailAndPassword,
    createOrganizer,
    updateOrganizer,
};