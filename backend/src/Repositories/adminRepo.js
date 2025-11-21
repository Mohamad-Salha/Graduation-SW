const Student = require("../../Database/models/Student");
const User = require("../../Database/models/User");

class AdminRepository {
	// Get all pending students
	async getPendingStudents() {
		return await Student.find({ status: "pending" }).populate(
			"userId",
			"name email phone createdAt"
		);
	}

	// Get all students
	async getAllStudents() {
		return await Student.find()
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name price")
			.populate("theoTeacherId", "userId")
			.populate("trainerId", "userId");
	}

	// Find student by ID
	async findStudentById(studentId) {
		return await Student.findById(studentId);
	}

	// Update student status
	async updateStudentStatus(studentId, status) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ status },
			{ new: true }
		);
	}
}

module.exports = new AdminRepository();
