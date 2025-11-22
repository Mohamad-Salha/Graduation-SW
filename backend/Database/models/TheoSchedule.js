/**
 * Example JSON response (TheoSchedule)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d8001",
 *   "teacherId": "6744c2f4e13b2a9f3c5d7001", // Teacher ObjectId
 *   "courseId": "6744c2f4e13b2a9f3c5d1201", // License ObjectId
 *   "weeklySlots": [
 *     { "day": "Sunday", "startTime": "17:00", "endTime": "19:00" },
 *     { "day": "Tuesday", "startTime": "17:00", "endTime": "19:00" },
 *     { "day": "Thursday", "startTime": "17:00", "endTime": "19:00" }
 *   ],
 *   "location": "Room B2",
 *   "isActive": true,
 *   "assignedStudents": [
 *     "6744c2f4e13b2a9f3c5d3001",
 *     "6744c2f4e13b2a9f3c5d3004"
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const WeeklySlotSchema = new Schema({
	day: {
		type: String,
		enum: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		required: true,
	},
	startTime: { type: String, required: true }, // e.g., "17:00"
	endTime: { type: String, required: true }, // e.g., "19:00"
});

const TheoScheduleSchema = new Schema({
	teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
	courseId: { type: Schema.Types.ObjectId, ref: "License", required: true },
	weeklySlots: [WeeklySlotSchema], // Recurring weekly schedule
	location: { type: String, required: true },
	isActive: { type: Boolean, default: true }, // Can disable schedule if needed
	assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("TheoSchedule", TheoScheduleSchema);
