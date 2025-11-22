const Trainer = require("../../Database/models/Trainer");
const Student = require("../../Database/models/Student");
const StudentSession = require("../../Database/models/StudentSession");
const PracticalSchedule = require("../../Database/models/PracticalSchedule");
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

	// === New Practical Schedule System ===

	// Create weekly schedule with recurring slots
	async createPracticalSchedule(scheduleData) {
		const schedule = new PracticalSchedule(scheduleData);
		return await schedule.save();
	}

	// Get trainer's active schedules
	async getTrainerSchedules(trainerId) {
		return await PracticalSchedule.find({
			trainerId,
			isActive: true,
		}).populate("weeklySlots.vehicleId", "model licensePlate");
	}

	// Get schedule by ID
	async getScheduleById(scheduleId) {
		return await PracticalSchedule.findById(scheduleId).populate(
			"weeklySlots.vehicleId",
			"model licensePlate"
		);
	}

	// Get specific slot by schedule and slot ID
	async getSlotById(scheduleId, slotId) {
		const schedule = await PracticalSchedule.findById(scheduleId);
		if (!schedule) return null;
		return schedule.weeklySlots.id(slotId);
	}

	// Book a slot for student
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

	// Mark slot attendance
	async markSlotAttendance(scheduleId, slotId, attended, paymentAmount) {
		return await PracticalSchedule.findOneAndUpdate(
			{ _id: scheduleId, "weeklySlots._id": slotId },
			{
				$set: {
					"weeklySlots.$.attended": attended,
					"weeklySlots.$.paymentAmount": paymentAmount || 0,
				},
			},
			{ new: true }
		);
	}

	// Get student's booked sessions from all schedules
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

	// Update schedule (e.g., deactivate)
	async updateSchedule(scheduleId, updateData) {
		return await PracticalSchedule.findByIdAndUpdate(
			scheduleId,
			updateData,
			{ new: true }
		);
	}
}

module.exports = new TrainerRepository();
