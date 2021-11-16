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
    style: Object,
    tags: Array,
    stats: Object,
    content: Array,
    backgroundImage: String,
    thumbnail: String,
    createdAt: String
});

module.exports = model('Quiz', quizSchema);