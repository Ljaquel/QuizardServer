const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    name: String,
    creator: Boolean,
    points: Number,
    color: String,
    history: Array,
    rewards: Object
});

module.exports = model('User', userSchema);