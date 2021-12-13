const { model, Schema } = require('mongoose');

const badgeSchema = new Schema({
  badgeType: {
    type: String,
    enum: ['Gold', 'Silver', 'Bronze']
  },
  title: String,
  points: Number,
  description: String
});

module.exports = model('Badge', badgeSchema);