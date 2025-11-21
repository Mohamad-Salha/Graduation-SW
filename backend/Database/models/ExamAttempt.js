/**
 * Example JSON response (ExamAttempt)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1101",
 *   "examId": "6744c2f4e13b2a9f3c5d1001", // Exam ObjectId
 *   "studentId": "6744c2f4e13b2a9f3c5d3001", // Student ObjectId
 *   "attemptNumber": 1,
 *   "status": "pending",
 *   "date": "2025-11-21T09:35:00.000Z",
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const ExamAttemptSchema = new Schema({
	examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
	studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	attemptNumber: { type: Number, default: 1 },
	status: {
		type: String,
		enum: ["pending", "passed", "failed"],
		default: "pending",
	},
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExamAttempt", ExamAttemptSchema);
