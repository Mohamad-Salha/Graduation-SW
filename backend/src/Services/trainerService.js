const trainerRepo = require("../Repositories/trainerRepo");
const authRepo = require("../Repositories/authRepos");

class TrainerService {
	// Get trainer profile
	async getProfile(userId) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		const user = await authRepo.findUserById(userId);

		return {
			trainerId: trainer._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			profilePicture: user.profilePicture || "",
			address: user.address || "",
			dateOfBirth: user.dateOfBirth || null,
			gender: user.gender || "",
			role: user.role,
			createdAt: user.createdAt,
			assignedStudentsCount: trainer.assignedStudents.length,
		};
	}

	// Update trainer profile
	async updateProfile(userId, updates) {
		const user = await authRepo.findUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const updatedUser = await authRepo.updateUserProfile(userId, updates);

		return {
			message: "Profile updated successfully",
			user: {
				name: updatedUser.name,
				email: updatedUser.email,
				phone: updatedUser.phone,
				address: updatedUser.address,
				dateOfBirth: updatedUser.dateOfBirth,
				gender: updatedUser.gender,
				profilePicture: updatedUser.profilePicture,
			},
		};
	}

	// Get assigned students
	async getAssignedStudents(userId) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		return {
			count: trainer.assignedStudents.length,
			students: trainer.assignedStudents.map((s) => ({
				studentId: s._id,
				name: s.userId.name,
				email: s.userId.email,
				phone: s.userId.phone,
				license: s.chosenLicense?.name || "N/A",
				theoPassed: s.theoPassed,
				practicalSessionsCompleted: s.practicalSessionsCompleted,
				practicalProgress: s.practicalProgress,
				minPracticalSessions:
					s.chosenLicense?.minPracticalSessions || 0,
				readyForPracticalExam: s.readyForPracticalExam,
			})),
		};
	}

	// === New Practical Schedule System ===

	// Create weekly availability schedule
	async createPracticalSchedule(
		userId,
		{ weeklySlots, repeatForWeeks, vehicleId }
	) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		// Add vehicleId to each slot if provided
		const slotsWithVehicle = weeklySlots.map((slot) => ({
			...slot,
			vehicleId: vehicleId || slot.vehicleId,
		}));

		const schedule = await trainerRepo.createPracticalSchedule({
			trainerId: trainer._id,
			weeklySlots: slotsWithVehicle,
			repeatForWeeks: repeatForWeeks || 1,
			isActive: true,
		});

		return {
			message: "Weekly schedule created successfully",
			scheduleId: schedule._id,
			repeatForWeeks: schedule.repeatForWeeks,
			slotsCount: schedule.weeklySlots.length,
		};
	}

	// Get trainer's schedules
	async getSchedules(userId) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		const schedules = await trainerRepo.getTrainerSchedules(trainer._id);

		return {
			count: schedules.length,
			schedules: schedules.map((s) => ({
				scheduleId: s._id,
				repeatForWeeks: s.repeatForWeeks,
				isActive: s.isActive,
				createdAt: s.createdAt,
				slots: s.weeklySlots.map((slot) => ({
					slotId: slot._id,
					day: slot.day,
					startTime: slot.startTime,
					endTime: slot.endTime,
					isBooked: slot.isBooked,
					bookedBy: slot.bookedBy || null,
					sessionDate: slot.sessionDate || null,
					attended: slot.attended,
					paymentAmount: slot.paymentAmount,
					vehicle: slot.vehicleId
						? `${slot.vehicleId.model} (${slot.vehicleId.licensePlate})`
						: "N/A",
				})),
			})),
		};
	}

	// Mark slot attendance
	async markSlotAttendance(
		userId,
		scheduleId,
		slotId,
		attended,
		paymentAmount
	) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		const schedule = await trainerRepo.getScheduleById(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		if (schedule.trainerId.toString() !== trainer._id.toString()) {
			throw new Error("This schedule does not belong to you");
		}

		const slot = schedule.weeklySlots.id(slotId);
		if (!slot) {
			throw new Error("Slot not found");
		}

		if (!slot.isBooked) {
			throw new Error("This slot is not booked");
		}

		await trainerRepo.markSlotAttendance(
			scheduleId,
			slotId,
			attended,
			paymentAmount
		);

		// Update student progress if attended
		if (attended && slot.bookedBy) {
			const attendedCount = await this.countStudentAttendedSlots(
				slot.bookedBy
			);
			const student = await trainerRepo.getStudentById(slot.bookedBy);
			const minSessions = student.chosenLicense.minPracticalSessions;
			const progress = Math.min(
				100,
				Math.round((attendedCount / minSessions) * 100)
			);

			await trainerRepo.updateStudentProgress(
				slot.bookedBy,
				attendedCount,
				progress
			);
		}

		return {
			message: "Attendance marked successfully",
			scheduleId,
			slotId,
			attended,
		};
	}

	// Helper: Count attended slots for student
	async countStudentAttendedSlots(studentId) {
		const schedules = await trainerRepo.getStudentBookedSlots(studentId);
		let count = 0;
		schedules.forEach((schedule) => {
			schedule.weeklySlots.forEach((slot) => {
				if (
					slot.bookedBy &&
					slot.bookedBy.toString() === studentId.toString() &&
					slot.attended
				) {
					count++;
				}
			});
		});
		return count;
	}

	// Old methods kept for backward compatibility
	async schedulePracticalSession(
		userId,
		{ studentId, date, time, vehicleId, paymentAmount }
	) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		// Check if student is assigned to this trainer
		const isAssigned = trainer.assignedStudents.some(
			(s) => s._id.toString() === studentId
		);
		if (!isAssigned) {
			throw new Error("This student is not assigned to you");
		}

		const student = await trainerRepo.getStudentById(studentId);
		if (!student.theoPassed) {
			throw new Error(
				"Student must pass theoretical exam before practical sessions"
			);
		}

		// Create session
		const session = await trainerRepo.createPracticalSession({
			trainerId: trainer._id,
			studentId,
			date,
			time,
			vehicleId,
			paymentAmount: paymentAmount || 0,
			attended: false,
		});

		return {
			message: "Practical session scheduled successfully",
			sessionId: session._id,
			studentId: session.studentId,
			date: session.date,
			time: session.time,
		};
	}

	// Get trainer's sessions
	async getSessions(userId) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		const sessions = await trainerRepo.getTrainerSessions(trainer._id);

		return {
			count: sessions.length,
			sessions: sessions.map((s) => ({
				sessionId: s._id,
				studentName: s.studentId?.userId?.name || "Unknown",
				studentId: s.studentId?._id,
				date: s.date,
				time: s.time,
				attended: s.attended,
				paymentAmount: s.paymentAmount,
				vehicle: s.vehicleId
					? `${s.vehicleId.model} (${s.vehicleId.licensePlate})`
					: "N/A",
			})),
		};
	}

	// Mark session attendance
	async markAttendance(userId, sessionId, attended) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		const session = await trainerRepo.getSessionById(sessionId);
		if (!session) {
			throw new Error("Session not found");
		}

		// Verify session belongs to this trainer
		if (session.trainerId._id.toString() !== trainer._id.toString()) {
			throw new Error("This session does not belong to you");
		}

		// Mark attendance
		const updatedSession = await trainerRepo.markSessionAttendance(
			sessionId,
			attended
		);

		// If attended, update student progress
		if (attended) {
			const attendedCount = await trainerRepo.countAttendedSessions(
				session.studentId._id,
				trainer._id
			);
			const student = await trainerRepo.getStudentById(
				session.studentId._id
			);
			const minSessions = student.chosenLicense.minPracticalSessions;
			const progress = Math.min(
				100,
				Math.round((attendedCount / minSessions) * 100)
			);

			await trainerRepo.updateStudentProgress(
				session.studentId._id,
				attendedCount,
				progress
			);
		}

		return {
			message: "Attendance marked successfully",
			sessionId: updatedSession._id,
			attended: updatedSession.attended,
		};
	}

	// Mark student ready for practical exam
	async markStudentReadyForPractical(userId, studentId) {
		const trainer = await trainerRepo.getTrainerByUserId(userId);
		if (!trainer) {
			throw new Error("Trainer profile not found");
		}

		// Check if student is assigned to this trainer
		const isAssigned = trainer.assignedStudents.some(
			(s) => s._id.toString() === studentId
		);
		if (!isAssigned) {
			throw new Error("This student is not assigned to you");
		}

		const student = await trainerRepo.getStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		if (!student.theoPassed) {
			throw new Error("Student must pass theoretical exam first");
		}

		// Check if student completed minimum sessions
		const minSessions = student.chosenLicense.minPracticalSessions;
		if (student.practicalSessionsCompleted < minSessions) {
			throw new Error(
				`Student must complete at least ${minSessions} practical sessions (completed: ${student.practicalSessionsCompleted})`
			);
		}

		const updatedStudent =
			await trainerRepo.markStudentReadyForPracticalExam(studentId);

		return {
			message: "Student marked as ready for practical exam",
			studentId: updatedStudent._id,
			studentName: student.userId.name,
		};
	}
}

module.exports = new TrainerService();
