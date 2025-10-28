const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  createdBy: { type: String, enum: ['system', 'admin'], default: 'system' },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
