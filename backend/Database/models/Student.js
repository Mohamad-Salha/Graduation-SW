/**
 * Example JSON response (Student)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d3001",
 *   "userId": "6744c2f4e13b2a9f3c5d4001", // User ObjectId
 *   "chosenLicense": "6744c2f4e13b2a9f3c5d1201", // License ObjectId
 *   "theoTeacherId": "6744c2f4e13b2a9f3c5d7001", // Teacher ObjectId
 *   "trainerId": "6744c2f4e13b2a9f3c5d5001", // Trainer ObjectId
 *   "theoPassed": false,
 *   "practicalProgress": 30,
 *   "practicalSessionsCompleted": 3,
 *   "status": "active",
 *   "courses": [
 *     {
 *       "_id": "6744c2f4e13b2a9f3c5d3002",
 *       "licenseId": "6744c2f4e13b2a9f3c5d1201",
 *       "status": "active"
 *     }
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const StudentSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	chosenLicense: { type: Schema.Types.ObjectId, ref: "License" },
	theoTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
	trainerId: { type: Schema.Types.ObjectId, ref: "Trainer" },
	theoPassed: { type: Boolean, default: false },
	practicalProgress: { type: Number, default: 0 },
	practicalSessionsCompleted: { type: Number, default: 0 },
	status: {
		type: String,
		enum: ["pending", "approved", "active", "inactive"],
		default: "pending",
	},
	courses: [
		{
			licenseId: { type: Schema.Types.ObjectId, ref: "License" },
			status: { type: String, enum: ["active", "completed", "failed"] },
		},
	],
});

module.exports = mongoose.model("Student", StudentSchema);
