const Student = require("../../Database/models/Student");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const Trainer = require("../../Database/models/Trainer");
const User = require("../../Database/models/User");
const ExamAttempt = require("../../Database/models/ExamAttempt");
const Exam = require("../../Database/models/Exam");
const StudentSession = require("../../Database/models/StudentSession");
const PracticalSchedule = require("../../Database/models/PracticalSchedule");

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

	// === Practical Session Management ===

	// Get all trainers
	async getAllTrainers() {
		return await Trainer.find().populate("userId", "name email phone");
	}

	// Get trainer by ID
	async getTrainerById(trainerId) {
		return await Trainer.findById(trainerId).populate(
			"userId",
			"name email phone"
		);
	}

	// Get student's practical sessions
	async getMyPracticalSessions(studentId) {
		return await StudentSession.find({ studentId })
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("vehicleId", "model licensePlate")
			.sort({ date: -1 });
	}

	// Add student to trainer's assigned students
	async addStudentToTrainer(trainerId, studentId) {
		return await Trainer.findByIdAndUpdate(
			trainerId,
			{ $addToSet: { assignedStudents: studentId } },
			{ new: true }
		);
	}

	// Assign trainer to student
	async assignTrainer(studentId, trainerId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ trainerId: trainerId },
			{ new: true }
		);
	}

	// === New Practical Schedule System ===

	// Get available practical schedules for student's trainer
	async getTrainerAvailableSlots(trainerId) {
		return await PracticalSchedule.find({
			trainerId,
			isActive: true,
		})
			.populate("trainerId")
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("weeklySlots.vehicleId", "model licensePlate");
	}

	// Get schedule by ID
	async getScheduleById(scheduleId) {
		return await PracticalSchedule.findById(scheduleId);
	}

	// Count student bookings for current week
	async countWeeklyBookings(studentId, weekStart, weekEnd) {
		const schedules = await PracticalSchedule.find({
			"weeklySlots.bookedBy": studentId,
			"weeklySlots.sessionDate": {
				$gte: weekStart,
				$lte: weekEnd,
			},
		});

		let count = 0;
		schedules.forEach((schedule) => {
			schedule.weeklySlots.forEach((slot) => {
				if (
					slot.bookedBy &&
					slot.bookedBy.toString() === studentId.toString() &&
					slot.sessionDate >= weekStart &&
					slot.sessionDate <= weekEnd
				) {
					count++;
				}
			});
		});

		return count;
	}

	// Book a slot
	async bookSlot(scheduleId, slotId, studentId, sessionDate) {
		return await PracticalSchedule.findOneAndUpdate(
			{ _id: scheduleId, "weeklySlots._id": slotId },
			{
				$set: {
					"weeklySlots.$.isBooked": true,
					"weeklySlots.$.bookedBy": studentId,
					"weeklySlots.$.sessionDate": sessionDate,
				},
			},
			{ new: true }
		);
	}

	// Get student's booked sessions
	async getStudentBookedSlots(studentId) {
		return await PracticalSchedule.find({
			"weeklySlots.bookedBy": studentId,
			isActive: true,
		})
			.populate("trainerId")
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("weeklySlots.vehicleId", "model licensePlate");
	}
}

module.exports = new StudentRepository();
