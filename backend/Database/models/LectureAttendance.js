/**
 * LectureAttendance Model
 * Tracks attendance for each theoretical lecture
 * 
 * Example JSON response:
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d9001",
 *   "scheduleId": "6744c2f4e13b2a9f3c5d8001",
 *   "teacherId": "6744c2f4e13b2a9f3c5d7001",
 *   "courseId": "6744c2f4e13b2a9f3c5d1201",
 *   "date": "2025-12-29T14:00:00.000Z",
 *   "weeklySlot": {
 *     "day": "Sunday",
 *     "startTime": "17:00",
 *     "endTime": "19:00"
 *   },
 *   "location": "Room B2",
 *   "topic": "Traffic Signs and Road Markings",
 *   "description": "Introduction to warning signs, regulatory signs, and guide signs",
 *   "status": "completed",
 *   "attendees": [
 *     {
 *       "studentId": "6744c2f4e13b2a9f3c5d3001",
 *       "status": "present",
 *       "checkInTime": "16:55",
 *       "notes": ""
 *     }
 *   ],
 *   "totalEnrolled": 15,
 *   "presentCount": 12,
 *   "absentCount": 3,
 *   "attendanceRate": 80,
 *   "lectureNotes": "Covered all warning signs. Students participated well.",
 *   "materials": [],
 *   "createdAt": "2025-12-27T10:00:00.000Z",
 *   "updatedAt": "2025-12-29T19:00:00.000Z"
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const AttendeeSchema = new Schema({
	studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	status: {
		type: String,
		enum: ["present", "absent", "late", "excused"],
		default: "absent",
	},
	checkInTime: { type: String }, // e.g., "17:05"
	notes: { type: String, default: "" }, // Reason for absence, etc.
});

const WeeklySlotRefSchema = new Schema({
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
	startTime: { type: String, required: true },
	endTime: { type: String, required: true },
});

const LectureAttendanceSchema = new Schema(
	{
		scheduleId: {
			type: Schema.Types.ObjectId,
			ref: "TheoSchedule",
			required: true,
		},
		teacherId: {
			type: Schema.Types.ObjectId,
			ref: "Teacher",
			required: true,
		},
		courseId: {
			type: Schema.Types.ObjectId,
			ref: "License",
			required: true,
		},
		date: { type: Date, required: true }, // Actual date of the lecture
		weeklySlot: { type: WeeklySlotRefSchema, required: true }, // Which slot from schedule
		location: { type: String, required: true },
		topic: { type: String, default: "" }, // Lecture topic/title
		description: { type: String, default: "" }, // Detailed description
		status: {
			type: String,
			enum: ["scheduled", "completed", "cancelled", "rescheduled"],
			default: "scheduled",
		},
		cancelReason: { type: String },
		attendees: [AttendeeSchema],
		totalEnrolled: { type: Number, default: 0 },
		presentCount: { type: Number, default: 0 },
		absentCount: { type: Number, default: 0 },
		lateCount: { type: Number, default: 0 },
		excusedCount: { type: Number, default: 0 },
		attendanceRate: { type: Number, default: 0 }, // Percentage
		lectureNotes: { type: String, default: "" }, // Teacher's notes after lecture
		materials: [{ type: String }], // URLs to uploaded materials
	},
	{ timestamps: true }
);

// Index for efficient queries
LectureAttendanceSchema.index({ teacherId: 1, date: 1 });
LectureAttendanceSchema.index({ scheduleId: 1, date: 1 });
LectureAttendanceSchema.index({ courseId: 1, date: 1 });

module.exports = mongoose.model("LectureAttendance", LectureAttendanceSchema);
