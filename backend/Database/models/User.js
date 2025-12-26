/**
 * Example JSON response (User)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d4001",
 *   "name": "Jane Doe",
 *   "email": "jane.doe@example.com",
 *   "password": "$2b$10$hashedexample...", // hashed value
 *   "phone": "+1-555-123-4567",
 *   "role": "student",
 *   "createdAt": "2025-11-20T12:00:00.000Z",
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }, // hashed
	phone: { type: String },
	role: {
		type: String,
		enum: ["student", "teacher", "trainer", "admin"],
		required: true,
	},
	profilePicture: { type: String, default: "" }, // Cloudinary URL
	address: { type: String },
	dateOfBirth: { type: Date },
	gender: { type: String, enum: ["male", "female"] },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
