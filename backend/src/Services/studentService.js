const studentRepo = require("../Repositories/studentRepo");
const authRepo = require("../Repositories/authRepos");

class StudentService {
	// Get all available licenses (only if student doesn't have active license)
	async getAvailableLicenses(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		// Check if student already has an active license
		if (student.chosenLicense) {
			throw new Error(
				"You already have an active license. Complete or cancel it before choosing a new one."
			);
		}

		const licenses = await studentRepo.getAllLicenses();
		return {
			count: licenses.length,
			licenses,
		};
	}

	// Get student profile
	async getProfile(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		const user = await authRepo.findUserById(userId);

		// Build clean response
		const profile = {
			studentId: student._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			status: student.status,
			theoPassed: student.theoPassed,
			practicalProgress: student.practicalProgress,
			practicalSessionsCompleted: student.practicalSessionsCompleted,
		};

		// Add license info if enrolled
		if (student.chosenLicense) {
			profile.license = {
				name: student.chosenLicense.name,
				description: student.chosenLicense.description,
				price: student.chosenLicense.price,
				minPracticalSessions:
					student.chosenLicense.minPracticalSessions,
			};
		}

		// Add teacher info if assigned
		if (student.theoTeacherId && student.theoTeacherId.userId) {
			profile.teacher = {
				name: student.theoTeacherId.userId.name,
				email: student.theoTeacherId.userId.email,
				phone: student.theoTeacherId.userId.phone,
			};
		}

		// Add trainer info if assigned
		if (student.trainerId && student.trainerId.userId) {
			profile.trainer = {
				name: student.trainerId.userId.name,
				email: student.trainerId.userId.email,
				phone: student.trainerId.userId.phone,
			};
		}

		return profile;
	}

	// Enroll in a course (license)
	async enrollInCourse(userId, licenseId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		// Check if student is approved
		if (student.status === "pending") {
			throw new Error("Your account is still pending admin approval");
		}

		// Check if student already has an active course
		const hasActiveCourse = student.courses.some(
			(c) => c.status === "active"
		);
		if (hasActiveCourse) {
			throw new Error(
				"You already have an active course. Complete it before enrolling in a new one."
			);
		}

		// Check if license exists
		const license = await studentRepo.getLicenseById(licenseId);
		if (!license) {
			throw new Error("License not found");
		}

		// Enroll student
		const updatedStudent = await studentRepo.enrollInLicense(
			student._id,
			licenseId
		);

		return {
			message: "Successfully enrolled in course",
			studentId: updatedStudent._id,
			license: updatedStudent.chosenLicense,
			status: updatedStudent.status,
		};
	}

	// Get all available teachers
	async getAvailableTeachers() {
		const teachers = await studentRepo.getAllTeachers();
		return {
			count: teachers.length,
			teachers: teachers.map((t) => ({
				teacherId: t._id,
				name: t.userId.name,
				email: t.userId.email,
				phone: t.userId.phone,
				assignedStudentsCount: t.assignedStudents.length,
			})),
		};
	}

	// Choose theoretical teacher
	async chooseTheoricalTeacher(userId, teacherId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		// Check if student has chosen a license
		if (!student.chosenLicense) {
			throw new Error("Please enroll in a course first");
		}

		// Check if teacher exists
		const teacher = await studentRepo.getTeacherById(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		// Assign teacher to student
		const updatedStudent = await studentRepo.chooseTeacher(
			student._id,
			teacherId
		);

		// Add student to teacher's assigned students
		await studentRepo.addStudentToTeacher(teacherId, student._id);

		return {
			message: "Successfully chose theoretical teacher",
			studentId: updatedStudent._id,
			teacher: {
				teacherId: teacher._id,
				name: teacher.userId.name,
				email: teacher.userId.email,
			},
		};
	}

	// === Exam Management ===

	// Get student's exams and attempts
	async getMyExams(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.chosenLicense) {
			throw new Error("Please enroll in a course first");
		}

		// Get student's attempts
		const attempts = await studentRepo.getMyExamAttempts(student._id);

		// Get upcoming exams for student's course
		const upcomingExams = await studentRepo.getUpcomingExamsForCourse(
			student.chosenLicense._id
		);

		return {
			attempts: attempts.map((a) => ({
				attemptId: a._id,
				examType: a.examId.type,
				courseName: a.examId.courseId.name,
				examDate: a.examId.date,
				location: a.examId.location,
				attemptNumber: a.attemptNumber,
				status: a.status,
			})),
			upcomingExams: upcomingExams.map((e) => ({
				examId: e._id,
				type: e.type,
				courseName: e.courseId.name,
				date: e.date,
				location: e.location,
			})),
		};
	}

	// Request retest (register for exam)
	async requestRetest(userId, examId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.chosenLicense) {
			throw new Error("Please enroll in a course first");
		}

		// Get next attempt number
		const attemptNumber = await studentRepo.getNextAttemptNumber(
			student._id,
			examId
		);

		// Create attempt
		const attempt = await studentRepo.createExamAttempt(
			examId,
			student._id,
			attemptNumber
		);

		return {
			message: "Successfully registered for exam",
			attemptId: attempt._id,
			attemptNumber: attempt.attemptNumber,
			status: attempt.status,
		};
	}

	// === Practical Session Management ===

	// Get available trainers
	async getAvailableTrainers(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.theoPassed) {
			throw new Error(
				"You must pass the theoretical exam before choosing a trainer"
			);
		}

		const trainers = await studentRepo.getAllTrainers();
		return {
			count: trainers.length,
			trainers: trainers.map((t) => ({
				trainerId: t._id,
				name: t.userId.name,
				email: t.userId.email,
				phone: t.userId.phone,
				assignedStudentsCount: t.assignedStudents.length,
			})),
		};
	}

	// Choose trainer
	async chooseTrainer(userId, trainerId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.theoPassed) {
			throw new Error(
				"You must pass the theoretical exam before choosing a trainer"
			);
		}

		if (student.trainerId) {
			throw new Error("You already have a trainer assigned");
		}

		// Check if trainer exists
		const trainer = await studentRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		// Assign trainer to student
		await studentRepo.assignTrainer(student._id, trainerId);

		// Add student to trainer's assigned students
		await studentRepo.addStudentToTrainer(trainerId, student._id);

		return {
			message: "Successfully chose trainer",
			studentId: student._id,
			trainer: {
				trainerId: trainer._id,
				name: trainer.userId.name,
				email: trainer.userId.email,
			},
		};
	}

	// === New Practical Booking System ===

	// View available slots from all trainers or specific trainer
	async viewAvailableSlots(userId, trainerId = null) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.theoPassed) {
			throw new Error(
				"You must pass the theoretical exam before booking practical sessions"
			);
		}

		const schedules = await studentRepo.getTrainerAvailableSlots(trainerId);

		const availableSlots = [];
		schedules.forEach((schedule) => {
			schedule.weeklySlots.forEach((slot) => {
				if (!slot.isBooked) {
					availableSlots.push({
						scheduleId: schedule._id,
						slotId: slot._id,
						trainerId: schedule.trainerId._id,
						trainerName: schedule.trainerId.userId.name,
						day: slot.day,
						startTime: slot.startTime,
						endTime: slot.endTime,
						vehicle: slot.vehicleId
							? `${slot.vehicleId.model} (${slot.vehicleId.licensePlate})`
							: "N/A",
					});
				}
			});
		});

		return {
			count: availableSlots.length,
			slots: availableSlots,
		};
	}

	// Book a practical slot
	async bookPracticalSlot(userId, scheduleId, slotId, sessionDate) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		if (!student.theoPassed) {
			throw new Error(
				"You must pass the theoretical exam before booking practical sessions"
			);
		}

		// Check weekly booking limit
		const currentWeekBookings = await studentRepo.countWeeklyBookings(
			student._id
		);
		if (currentWeekBookings >= student.maxSessionsPerWeek) {
			throw new Error(
				`You have reached your weekly booking limit of ${student.maxSessionsPerWeek} sessions`
			);
		}

		// Get schedule and validate
		const schedule = await studentRepo.getScheduleById(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		if (!schedule.isActive) {
			throw new Error("This schedule is no longer active");
		}

		const slot = schedule.weeklySlots.id(slotId);
		if (!slot) {
			throw new Error("Slot not found");
		}

		if (slot.isBooked) {
			throw new Error("This slot is already booked");
		}

		// Book the slot
		await studentRepo.bookSlot(
			scheduleId,
			slotId,
			student._id,
			sessionDate
		);

		return {
			message: "Slot booked successfully",
			scheduleId,
			slotId,
			sessionDate,
			trainerName: schedule.trainerId.userId.name,
			day: slot.day,
			time: `${slot.startTime} - ${slot.endTime}`,
		};
	}

	// Get student's booked sessions
	async getMyBookedSessions(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		const schedules = await studentRepo.getStudentBookedSlots(student._id);

		const bookedSessions = [];
		schedules.forEach((schedule) => {
			schedule.weeklySlots.forEach((slot) => {
				if (
					slot.bookedBy &&
					slot.bookedBy.toString() === student._id.toString()
				) {
					bookedSessions.push({
						scheduleId: schedule._id,
						slotId: slot._id,
						trainerId: schedule.trainerId._id,
						trainerName: schedule.trainerId.userId.name,
						day: slot.day,
						startTime: slot.startTime,
						endTime: slot.endTime,
						sessionDate: slot.sessionDate,
						attended: slot.attended,
						paymentAmount: slot.paymentAmount,
						vehicle: slot.vehicleId
							? `${slot.vehicleId.model} (${slot.vehicleId.licensePlate})`
							: "N/A",
					});
				}
			});
		});

		return {
			count: bookedSessions.length,
			sessions: bookedSessions,
			practicalProgress: student.practicalProgress,
			sessionsCompleted: student.practicalSessionsCompleted,
			minRequiredSessions:
				student.chosenLicense?.minPracticalSessions || 0,
		};
	}

	// Old method kept for backward compatibility
	async getMyPracticalSessions(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student profile not found");
		}

		const sessions = await studentRepo.getMyPracticalSessions(student._id);

		return {
			count: sessions.length,
			sessions: sessions.map((s) => ({
				sessionId: s._id,
				trainerName: s.trainerId?.userId?.name || "N/A",
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
}

module.exports = new StudentService();
