const userDAO = require('../data-access/userDAO');

const registerUser = async (userData) => {
    const existing = await userDAO.findUserByEmail(userData.email);
    if (existing) throw new Error('User already exists');
    return await userDAO.createUser(userData);
};

module.exports = {
    registerUser,
};