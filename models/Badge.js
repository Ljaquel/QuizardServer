const { model, Schema } = require("mongoose");

const badgeSchema = new Schema({
  badgeType: {
    type: String,
    enum: ["Gold", "Silver", "Bronze"]
  },
  title: String,
  points: Number,
  description: String,
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
  modifiedAt: {
    type: String,
    default: new Date().toISOString()
  }
});

module.exports = model("Badge", badgeSchema);
