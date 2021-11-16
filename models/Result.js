const { model, Schema } = require('mongoose');

const resultSchema = new Schema({
  userId: String,
  quizId: String,
  score: Number,
  time: String,
  badges: Array,
  record: Array,
  createdAt: String
});

module.exports = model('Result', resultSchema);