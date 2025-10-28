const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 0, max: 5, required: true },
  comment: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
