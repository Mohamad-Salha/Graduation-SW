/**
 * Example JSON response (Teacher)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d7001",
 *   "userId": "6744c2f4e13b2a9f3c5d4002", // User ObjectId
 *   "assignedStudents": [
 *     "6744c2f4e13b2a9f3c5d3001",
 *     "6744c2f4e13b2a9f3c5d3003"
 *   ],
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const TeacherSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("Teacher", TeacherSchema);
