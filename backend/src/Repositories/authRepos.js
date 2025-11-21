const mongoose = require("../../Database/connection");
const User = require("../../Database/models/User");
const Student = require("../../Database/models/Student");

class AuthRepository {
	// Find user by email
	async findUserByEmail(email) {
		return await User.findOne({ email });
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
}

module.exports = new AuthRepository();
