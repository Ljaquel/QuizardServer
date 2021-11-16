const { model, Schema } = require('mongoose');

const badgeSchema = new Schema({
  image: String,
  title: String,
  points: Number,
  description: String
});

module.exports = model('Badge', badgeSchema);