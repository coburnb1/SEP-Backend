const User = require('../models/userModel');

const findUserByEmail = async (email) => {
    return User.findOne({email});
};

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

module.exports = {
    findUserByEmail,
    createUser,
};