const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;

const notificationSchema = new Schema({
  type: String,
  to: { type: ObjectId, ref: "User" },
  fromU: { type: ObjectId, ref: "User" },
  fromP: { type: ObjectId, ref: "Platform" },
  subject: { type: ObjectId, ref: "Quiz" },
  message: String,
  seen: Boolean,
  createdAt: {type: Date, expires: 86400}
});

notificationSchema.index({createdAt: 1}, {expireAfterSeconds: 86400})

module.exports = model('Notification', notificationSchema);