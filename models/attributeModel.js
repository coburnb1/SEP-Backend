/* NOT NEEDED RIGHT NOW, KEEP AS A REFERENCE
const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    answer_choices: [{type: String, required: true}],
    rule: {type: String, required: true},
    priority: {type: Number, required: true},
})


module.exports = mongoose.model('Attribute', attributeSchema);

 */