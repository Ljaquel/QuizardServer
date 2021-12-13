const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types;

const quizSchema = new Schema({
  name: String,
  description: String,
  publishedDate: String,
  published: Boolean,
  creator: { type: ObjectId, ref: "User" },
  platform: { type: ObjectId, ref: "Platform" },
  timesPlayed: Number,
  usersThatPlayed: Number,
  time: String,
  rating: Number,
  ratingCount: Number,
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
  category: String,
  stats: Object,
  content: Array,
  backgroundImage: Object,
  thumbnail: Object,
  createdAt: String,
});

module.exports = model("Quiz", quizSchema);
