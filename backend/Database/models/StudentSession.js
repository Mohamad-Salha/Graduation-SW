/**
 * Example JSON response (StudentSession)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d3101",
 *   "studentId": "6744c2f4e13b2a9f3c5d3001", // Student ObjectId
 *   "trainerId": "6744c2f4e13b2a9f3c5d5001", // Trainer ObjectId
 *   "vehicleId": "6744c2f4e13b2a9f3c5d6001", // Vehicle ObjectId
 *   "date": "2025-11-24T08:00:00.000Z",
 *   "time": "08:00",
 *   "attended": true,
 *   "paymentAmount": 35,
 *   "progressPercentage": 10,
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const StudentSessionSchema = new Schema({
	studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
	vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
	date: { type: Date, required: true },
	time: { type: String, required: true },
	attended: { type: Boolean, default: false },
	paymentAmount: { type: Number, default: 0 },
	progressPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model("StudentSession", StudentSessionSchema);
