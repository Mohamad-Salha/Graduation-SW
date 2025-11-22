const Trainer = require("../../Database/models/Trainer");
const Student = require("../../Database/models/Student");
const StudentSession = require("../../Database/models/StudentSession");
const User = require("../../Database/models/User");

class TrainerRepository {
	// Get trainer by user ID
	async getTrainerByUserId(userId) {
		return await Trainer.findOne({ userId })
			.populate("userId", "name email phone")
			.populate({
				path: "assignedStudents",
				populate: [
					{ path: "userId", select: "name email phone" },
					{
						path: "chosenLicense",
						select: "name price minPracticalSessions",
					},
				],
			});
	}

	// Get trainer by ID
	async getTrainerById(trainerId) {
		return await Trainer.findById(trainerId).populate(
			"userId",
			"name email phone"
		);
	}

	// Get assigned students for a trainer
	async getAssignedStudents(trainerId) {
		const trainer = await Trainer.findById(trainerId).populate({
			path: "assignedStudents",
			populate: [
				{ path: "userId", select: "name email phone" },
				{
					path: "chosenLicense",
					select: "name price minPracticalSessions",
				},
			],
		});
		return trainer ? trainer.assignedStudents : [];
	}

	// Create practical session
	async createPracticalSession(sessionData) {
		const session = new StudentSession(sessionData);
		return await session.save();
	}

	// Get trainer's sessions
	async getTrainerSessions(trainerId) {
		return await StudentSession.find({ trainerId })
			.populate("studentId")
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("vehicleId", "model licensePlate")
			.sort({ date: -1 });
	}

	// Get sessions for specific student
	async getStudentSessions(studentId, trainerId) {
		return await StudentSession.find({ studentId, trainerId })
			.populate("vehicleId", "model licensePlate")
			.sort({ date: 1 });
	}

	// Mark session attendance
	async markSessionAttendance(sessionId, attended) {
		return await StudentSession.findByIdAndUpdate(
			sessionId,
			{ attended },
			{ new: true }
		);
	}

	// Get session by ID
	async getSessionById(sessionId) {
		return await StudentSession.findById(sessionId)
			.populate("studentId")
			.populate("trainerId")
			.populate("vehicleId");
	}

	// Update student progress
	async updateStudentProgress(
		studentId,
		practicalSessionsCompleted,
		practicalProgress
	) {
		return await Student.findByIdAndUpdate(
			studentId,
			{
				practicalSessionsCompleted,
				practicalProgress,
			},
			{ new: true }
		);
	}

	// Mark student ready for practical exam
	async markStudentReadyForPracticalExam(studentId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ readyForPracticalExam: true },
			{ new: true }
		);
	}

	// Get student by ID
	async getStudentById(studentId) {
		return await Student.findById(studentId)
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name price minPracticalSessions");
	}

	// Count attended sessions for student
	async countAttendedSessions(studentId, trainerId) {
		return await StudentSession.countDocuments({
			studentId,
			trainerId,
			attended: true,
		});
	}
}

module.exports = new TrainerRepository();
