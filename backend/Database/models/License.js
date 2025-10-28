const mongoose = require('mongoose');
const { Schema } = mongoose;

const licenseSchema = new Schema({
  name: { type: String, required: true }, // e.g., Automatic, Manual, Motorcycle
  minTheoreticalLessons: Number,
  minPracticalSessions: Number,
  allowedVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('License', licenseSchema);
