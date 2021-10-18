const { model, Schema } = require('mongoose');

const noteSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
});

module.exports = model('Note', noteSchema);