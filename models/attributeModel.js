const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    answer_choices: [{String, required: true}],
    rule: {type: String, required: true},
    priority: {type: Number, required: true},
})


module.exports = mongoose.model('Attribute', attributeSchema);