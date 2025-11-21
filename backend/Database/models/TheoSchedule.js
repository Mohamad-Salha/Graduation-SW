/**
 * Example JSON response (TheoSchedule)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d8001",
 *   "teacherId": "6744c2f4e13b2a9f3c5d7001", // Teacher ObjectId
 *   "courseId": "6744c2f4e13b2a9f3c5d1201", // License ObjectId
 *   "date": "2025-11-23T13:00:00.000Z",
 *   "time": "13:00",
 *   "location": "Room B2",
 *   "assignedStudents": [
 *     "6744c2f4e13b2a9f3c5d3001",
 *     "6744c2f4e13b2a9f3c5d3004"
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const TheoScheduleSchema = new Schema({
	teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
	courseId: { type: Schema.Types.ObjectId, ref: "License", required: true },
	date: { type: Date, required: true },
	time: { type: String, required: true },
	location: { type: String },
	assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("TheoSchedule", TheoScheduleSchema);
