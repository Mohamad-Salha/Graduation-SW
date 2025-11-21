/**
 * Example JSON response (Trainer)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d5001",
 *   "userId": "6744c2f4e13b2a9f3c5d4003", // User ObjectId
 *   "assignedStudents": [
 *     "6744c2f4e13b2a9f3c5d3001"
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const TrainerSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("Trainer", TrainerSchema);
