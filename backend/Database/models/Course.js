const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true }, // Theoretical or Practical
  license: { type: Schema.Types.ObjectId, ref: 'License', required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }]
});

module.exports = mongoose.model('Course', courseSchema);
