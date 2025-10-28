const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['student', 'instructor', 'trainer', 'admin'], required: true },
  
  // Role-specific subdocuments
  studentDetails: {
    license: { type: Schema.Types.ObjectId, ref: 'License' },
    enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],
    progress: [{ type: Schema.Types.ObjectId, ref: 'Progress' }],
    ratingsGiven: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }]
  },
  trainerDetails: {
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
    ratingsReceived: [{ type: Schema.Types.ObjectId, ref: 'Rating' }]
  },
  instructorDetails: {
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
  }
});

module.exports = mongoose.model('User', userSchema);
