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
			assignedStudentsCount: trainer.assignedStudents.length,
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

	// Schedule practical session
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
