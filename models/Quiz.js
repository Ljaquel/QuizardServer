const { model, Schema } = require('mongoose');

const questionSchema = new Schema({
  question: String,
  answer: Number,
  choices: [String]
})

const Question = model('Question', questionSchema).schema;

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
    content: [Question],
    backgroundImage: Buffer,
    thumbnail: Buffer,
    createdAt: String
});

module.exports = model('Quiz', quizSchema);