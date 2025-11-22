const Student = require("../../Database/models/Student");
const User = require("../../Database/models/User");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const Trainer = require("../../Database/models/Trainer");
const Exam = require("../../Database/models/Exam");
const ExamAttempt = require("../../Database/models/ExamAttempt");

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

	// === Exam Management ===

	// Create new exam
	async createExam(examData) {
		const exam = new Exam(examData);
		return await exam.save();
	}

	// Get all exams
	async getAllExams() {
		return await Exam.find()
			.populate("courseId", "name description")
			.sort({ date: 1 });
	}

	// Get exam by ID
	async getExamById(examId) {
		return await Exam.findById(examId).populate(
			"courseId",
			"name description"
		);
	}

	// Get students ready for theoretical exam
	async getStudentsReadyForTheoExam() {
		return await Student.find({ readyForTheoExam: true, theoPassed: false })
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name")
			.populate({
				path: "theoTeacherId",
				populate: { path: "userId", select: "name" },
			});
	}

	// Get students ready for practical exam
	async getStudentsReadyForPracticalExam() {
		return await Student.find({
			theoPassed: true,
			readyForPracticalExam: true,
		})
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name")
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name" },
			});
	}

	// Create exam attempt
	async createExamAttempt(examId, studentId, attemptNumber) {
		const attempt = new ExamAttempt({
			examId,
			studentId,
			attemptNumber,
			status: "pending",
		});
		return await attempt.save();
	}

	// Get student's exam attempts
	async getStudentExamAttempts(studentId) {
		return await ExamAttempt.find({ studentId })
			.populate({
				path: "examId",
				populate: { path: "courseId", select: "name" },
			})
			.sort({ date: -1 });
	}

	// Update exam attempt result
	async updateExamAttemptResult(attemptId, status) {
		return await ExamAttempt.findByIdAndUpdate(
			attemptId,
			{ status },
			{ new: true }
		);
	}

	// Get exam attempt by ID
	async getExamAttemptById(attemptId) {
		return await ExamAttempt.findById(attemptId)
			.populate("studentId")
			.populate("examId");
	}

	// Update student - mark theoretical exam as passed
	async markStudentTheoPassed(studentId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoPassed: true, readyForTheoExam: false },
			{ new: true }
		);
	}

	// Get all exam attempts for a specific exam
	async getExamAttempts(examId) {
		return await ExamAttempt.find({ examId })
			.populate("studentId")
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name email phone" },
			})
			.sort({ attemptNumber: 1 });
	}
}

module.exports = new AdminRepository();
