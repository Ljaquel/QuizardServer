const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types;

const quizSchema = new Schema({
  name: String,
  description: String,
  publishedDate: String,
  published: Boolean,
  creator: { type: ObjectId, ref: "User" },
  timesPlayed: Number,
  time: String,
  rating: Number,
  comments: [
    {
      body: String,
      user: { type: ObjectId, ref: "User" },
      createdAt: String,
    },
  ],
  difficulty: String,
  style: Object,
  tags: Array,
  stats: Object,
  content: Array,
  backgroundImage: Object,
  thumbnail: Object,
  createdAt: String,
});

module.exports = model("Quiz", quizSchema);
