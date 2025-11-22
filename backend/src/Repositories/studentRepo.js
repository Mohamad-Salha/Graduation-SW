const Student = require("../../Database/models/Student");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const User = require("../../Database/models/User");
const ExamAttempt = require("../../Database/models/ExamAttempt");
const Exam = require("../../Database/models/Exam");

class StudentRepository {
	// Get all available licenses
	async getAllLicenses() {
		return await License.find();
	}

	// Get license by ID
	async getLicenseById(licenseId) {
		return await License.findById(licenseId);
	}

	// Get student by user ID
	async getStudentByUserId(userId) {
		return await Student.findOne({ userId })
			.populate(
				"chosenLicense",
				"name description price minPracticalSessions"
			)
			.populate({
				path: "theoTeacherId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name email phone" },
			});
	}

	// Get student by ID
	async getStudentById(studentId) {
		return await Student.findById(studentId)
			.populate(
				"chosenLicense",
				"name description price minPracticalSessions"
			)
			.populate("theoTeacherId")
			.populate("trainerId");
	}

	// Enroll student in a license
	async enrollInLicense(studentId, licenseId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{
				chosenLicense: licenseId,
				status: "active",
				$push: {
					courses: {
						licenseId: licenseId,
						status: "active",
					},
				},
			},
			{ new: true }
		).populate(
			"chosenLicense",
			"name description price minPracticalSessions"
		);
	}

	// Choose theoretical teacher
	async chooseTeacher(studentId, teacherId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoTeacherId: teacherId },
			{ new: true }
		).populate("theoTeacherId");
	}

	// Get all teachers
	async getAllTeachers() {
		return await Teacher.find().populate("userId", "name email phone");
	}

	// Get teacher by ID
	async getTeacherById(teacherId) {
		return await Teacher.findById(teacherId).populate(
			"userId",
			"name email phone"
		);
	}

	// Add student to teacher's assigned students
	async addStudentToTeacher(teacherId, studentId) {
		return await Teacher.findByIdAndUpdate(
			teacherId,
			{ $addToSet: { assignedStudents: studentId } },
			{ new: true }
		);
	}

	// === Exam Management ===

	// Get student's exam attempts with exam details
	async getMyExamAttempts(studentId) {
		return await ExamAttempt.find({ studentId })
			.populate({
				path: "examId",
				populate: { path: "courseId", select: "name" },
			})
			.sort({ date: -1 });
	}

	// Get upcoming exams for student's course
	async getUpcomingExamsForCourse(courseId) {
		const now = new Date();
		return await Exam.find({
			courseId,
			date: { $gte: now },
		})
			.populate("courseId", "name")
			.sort({ date: 1 });
	}

	// Create exam attempt (student registers for exam)
	async createExamAttempt(examId, studentId, attemptNumber) {
		const attempt = new ExamAttempt({
			examId,
			studentId,
			attemptNumber,
			status: "pending",
		});
		return await attempt.save();
	}

	// Get next attempt number for student
	async getNextAttemptNumber(studentId, examId) {
		const attempts = await ExamAttempt.find({ studentId, examId });
		return attempts.length + 1;
	}
}

module.exports = new StudentRepository();
