const organizerDAO = require('../data-access/organizerDAO');
const bcrypt = require('bcrypt');


const getOrganizer = async  (email, password) => {
    try {
        const organizer = await organizerDAO.getOrganizerByEmail(email);
        if (!organizer) return null;

        const isMatch = await bcrypt.compare(password, organizer.password);
        if (!isMatch) return null;

        return organizer;
    }
    catch (err) {
        console.error('Error finding organizer:', err);
        throw err;
    }
};

const registerOrganizer = async (organizerData) => {
    try {
        const hashed_password = await hashPassword(organizerData.password);

        const existing = await organizerDAO.getOrganizerByEmail(organizerData.email);
        if (existing) throw new Error('Organizer already exists');

        organizerData.password = hashed_password;
        return await organizerDAO.createOrganizer(organizerData);
    }
    catch (err) {
        console.error('Error creating organizer:', err);
        throw err;
    }
};

const updateOrganizer = async (organizerID, updatedData) => {
    try {
        //collect and add only new name, email, and password
        const updateFields = {};

        //if given new name, take it and add to updateFields
        if (updatedData.name) {
            updateFields.name = updatedData.name;
        }

        //if given new email, check for uniqueness, and then add to updateFields if valid
        if (updatedData.email) {
            const existing = await organizerDAO.getOrganizerByEmail(updatedData.email);
            if (existing) {
                throw new Error('Email is already in use by another organizer');
            }
            updateFields.email = updatedData.email;
        }

        //if given new password, hash it first before adding it to the updateFields function.
        if (updatedData.password) {
            const hashedPassword = await hashPassword(updatedData.password);
            updateFields.password = hashedPassword;
        }

        return await organizerDAO.updateOrganizer(organizerID, updateFields);
    }
    catch (err) {
        console.error('Error updating organizer:', err);
        throw err;
    }
}

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
};

module.exports = {
    registerOrganizer,
    getOrganizer,
    updateOrganizer,
};