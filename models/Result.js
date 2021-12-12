const { model, Schema } = require('mongoose');

const resultSchema = new Schema({
  userId: String,
  quizId: String,
  score: Number,
  time: String,
  timesTaken: Number,
  badges: Array,
  record: Array,
  rating: Number,
  last: Number,
  lastTime: String,
  lastRecord: Array,
  bestAttemptAt: String,
  modifiedAt: String,
  createdAt: String
});

module.exports = model('Result', resultSchema);