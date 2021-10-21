const { model, Schema } = require('mongoose');

const quizSchema = new Schema({
    name: String,
    description: String,
    publishedDate: String,
    published: Boolean,
    creator: String,	
    timesPlayed: Number,
    time: String,
    rating: Number,
    comments: Array,
    difficulty: String,
    color: String,
    stats: Object,
    content: Array,
    backgroundImage: Buffer,
    thumbnail: Buffer,
    createdAt: String
});

module.exports = model('Quiz', quizSchema);