const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    organizer_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Organizer' },
    group_size: {type: Number, required: true},
    attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }]
})


module.exports = mongoose.model('Organization', organizationSchema);