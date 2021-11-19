const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  points: Number,
  level: Number,
  color: String,
  avatar: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
