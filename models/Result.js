const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;

const resultSchema = new Schema({
  userId: String,
  quizId: String,
  score: Number,
  time: String,
  timesTaken: Number,
  badge: {
    key: String,
    title: String,
    description: String,
    quiz: { type: ObjectId, ref: "Quiz" },
    createdAt: String,
  },
  badges: [
    {
      key: String,
      title: String,
      description: String,
      quiz: { type: ObjectId, ref: "Quiz" },
      createdAt: String,
    }
  ],
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