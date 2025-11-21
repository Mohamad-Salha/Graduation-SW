/**
 * Example JSON response (Notification)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1301",
 *   "userId": "6744c2f4e13b2a9f3c5d4001", // User ObjectId
 *   "type": "exam",
 *   "message": "Your theoretical exam is scheduled tomorrow at 09:30.",
 *   "date": "2025-11-20T14:15:00.000Z",
 *   "read": false,
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const NotificationSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	type: { type: String }, // 'exam', 'session', 'payment', etc.
	message: { type: String, required: true },
	date: { type: Date, default: Date.now },
	read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationSchema);
