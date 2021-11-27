const { model, Schema } = require('mongoose');

const resultSchema = new Schema({
  userId: String,
  quizId: String,
  score: Number,
  time: String,
  badges: Array,
  record: Array,
  last: Number,
  rating: Number,
  lastRecord: Array,
  modifiedAt: String,
  createdAt: String
});

module.exports = model('Result', resultSchema);