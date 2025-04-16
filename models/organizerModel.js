const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true },
    organization_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }]
});

module.exports = mongoose.model('Organizer', organizerSchema);