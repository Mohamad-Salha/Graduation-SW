const mongoose = require('mongoose');
const { Schema } = mongoose;

const enrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  progressRecords: [{ type: Schema.Types.ObjectId, ref: 'Progress' }]
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
