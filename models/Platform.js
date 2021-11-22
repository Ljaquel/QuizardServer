const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types;

const platformSchema = new Schema({
  name: String,
  description: String,
  creator: { type: ObjectId, ref: "User" },
  image: Object,
  banner: Object,
  rating: Number,
  followers: Array,
  following: Array,
  createdAt: String,
});

module.exports = model("Platform", platformSchema);
