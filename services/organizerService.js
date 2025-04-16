const organizerDAO = require('../data-access/organizerDAO');

const getOrganizer = async  (email, password) => {
    try {
        return await organizerDAO.getOrganizerByEmailAndPassword(email, password);
    }
    catch (err) {
        console.error('Error finding organizer:', err);
        throw err;
    }
};

const registerOrganizer = async (organizerData) => {
    try {
        const existing = await organizerDAO.getOrganizerByEmailAndPassword(organizerData.email, organizerData.password);
        if (existing) throw new Error('Organizer already exists');
        return await organizerDAO.createOrganizer(organizerData);
    }
    catch (err) {
        console.error('Error creating organizer:', err);
        throw err;
    }
};

const updateOrganizer = async (organizerID, updatedData) => {
    try {
        return await organizerDAO.updateOrganizer(organizerID, updatedData);
    }
    catch (err) {
        console.error('Error updating organizer:', err);
        throw err;
    }
}

module.exports = {
    registerOrganizer,
    getOrganizer,
    updateOrganizer,
};