const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer' },
    group_size: { type: Number, required: true },
    attributes: [{
        name: { type: String, required: true },
        answer_choices: [{ type: String, required: true }],
        rule: { type: String, required: true },
        priority: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Organization', organizationSchema);