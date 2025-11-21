/**
 * Example JSON response (Exam)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1001",
 *   "type": "theoretical",
 *   "courseId": "6744c2f4e13b2a9f3c5d2001", // License ObjectId
 *   "date": "2025-11-21T09:30:00.000Z",
 *   "location": "Main Hall",
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const ExamSchema = new Schema({
	type: { type: String, enum: ["theoretical", "practical"], required: true },
	courseId: { type: Schema.Types.ObjectId, ref: "License", required: true },
	date: { type: Date, required: true },
	location: { type: String },
});

module.exports = mongoose.model("Exam", ExamSchema);
