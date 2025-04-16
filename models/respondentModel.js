const mongoose = require('mongoose');

const respondentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    organizationID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    availability: [{ type: String }],
    attribute_responses: [
        {
            id: { type: Number, required: true },
            response: { type: String, required: true }
        }
    ],
    group_number: {type: Number, default: null},
    is_group_leader: {type: Boolean, default: false}
});

module.exports = mongoose.model('Respondent', respondentSchema);