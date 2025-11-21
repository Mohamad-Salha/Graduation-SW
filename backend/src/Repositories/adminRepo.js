const Student = require("../../Database/models/Student");
const User = require("../../Database/models/User");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const Trainer = require("../../Database/models/Trainer");

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

	// === License Management ===

	// Create new license
	async createLicense(licenseData) {
		const license = new License(licenseData);
		return await license.save();
	}

	// Get all licenses
	async getAllLicenses() {
		return await License.find();
	}

	// === Teacher Management ===

	// Create new teacher (user + teacher profile)
	async createTeacher(userData) {
		const user = new User(userData);
		const savedUser = await user.save();

		const teacher = new Teacher({ userId: savedUser._id });
		await teacher.save();

		return { user: savedUser, teacher };
	}

	// Get all teachers
	async getAllTeachers() {
		return await Teacher.find().populate("userId", "name email phone");
	}

	// === Trainer Management ===

	// Create new trainer (user + trainer profile)
	async createTrainer(userData) {
		const user = new User(userData);
		const savedUser = await user.save();

		const trainer = new Trainer({ userId: savedUser._id });
		await trainer.save();

		return { user: savedUser, trainer };
	}

	// Get all trainers
	async getAllTrainers() {
		return await Trainer.find().populate("userId", "name email phone");
	}
}

module.exports = new AdminRepository();
