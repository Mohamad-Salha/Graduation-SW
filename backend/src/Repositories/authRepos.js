const mongoose = require("../../Database/connection");
const User = require("../../Database/models/User");
const Student = require("../../Database/models/Student");

class AuthRepository {
	// Find user by email
	async findUserByEmail(email) {
		return await User.findOne({ email });
	}

	// Find user by email or name
	async findUserByEmailOrName(emailOrName) {
		return await User.findOne({
			$or: [{ email: emailOrName }, { name: emailOrName }],
		});
	}

	// Create new user
	async createUser(userData) {
		const user = new User(userData);
		return await user.save();
	}

	// Create new student profile
	async createStudent(userId) {
		const student = new Student({
			userId,
			status: "pending", // Waiting for admin approval
		});
		return await student.save();
	}

	// Find user by ID
	async findUserById(userId) {
		return await User.findById(userId);
	}

	// Find student by user ID
	async findStudentByUserId(userId) {
		return await Student.findOne({ userId });
	}

	// Update user profile fields
	async updateUserProfile(userId, updates) {
		const allowedUpdates = [
			"name",
			"phone",
			"address",
			"dateOfBirth",
			"gender",
		];
		const filteredUpdates = {};

		// Only update allowed fields
		for (const key of allowedUpdates) {
			if (updates[key] !== undefined) {
				filteredUpdates[key] = updates[key];
			}
		}

		return await User.findByIdAndUpdate(
			userId,
			{ $set: filteredUpdates },
			{ new: true, runValidators: true }
		);
	}

	// Update user profile picture
	async updateUserProfilePicture(userId, imageUrl) {
		return await User.findByIdAndUpdate(
			userId,
			{ $set: { profilePicture: imageUrl } },
			{ new: true }
		);
	}
}

module.exports = new AuthRepository();
