/**
 * Example JSON response (PracticalSchedule)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1401",
 *   "trainerId": "6744c2f4e13b2a9f3c5d5001", // Trainer ObjectId
 *   "week": 47,
 *   "sessions": [
 *     {
 *       "_id": "6744c2f4e13b2a9f3c5d1402",
 *       "date": "2025-11-24T08:00:00.000Z",
 *       "time": "08:00",
 *       "available": false,
 *       "studentId": "6744c2f4e13b2a9f3c5d3001", // Student ObjectId
 *       "vehicleId": "6744c2f4e13b2a9f3c5d6001" // Vehicle ObjectId
 *     },
 *     {
 *       "_id": "6744c2f4e13b2a9f3c5d1403",
 *       "date": "2025-11-25T10:00:00.000Z",
 *       "time": "10:00",
 *       "available": true,
 *       "studentId": null,
 *       "vehicleId": "6744c2f4e13b2a9f3c5d6002"
 *     }
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const PracticalScheduleSchema = new Schema({
	trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
	week: { type: Number },
	sessions: [
		{
			date: { type: Date, required: true },
			time: { type: String, required: true },
			available: { type: Boolean, default: true },
			studentId: { type: Schema.Types.ObjectId, ref: "Student" },
			vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
		},
	],
});

module.exports = mongoose.model("PracticalSchedule", PracticalScheduleSchema);
