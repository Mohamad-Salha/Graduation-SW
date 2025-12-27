const teacherRepo = require("../Repositories/teacherRepo");
const authRepo = require("../Repositories/authRepos");

class TeacherService {
	// Get teacher profile
	async getProfile(userId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const user = await authRepo.findUserById(userId);

		return {
			teacherId: teacher._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			profilePicture: user.profilePicture || "",
			address: user.address || "",
			dateOfBirth: user.dateOfBirth || null,
			gender: user.gender || "",
			role: user.role,
			createdAt: user.createdAt,
			assignedStudentsCount: teacher.assignedStudents.length,
		};
	}

	// Update teacher profile
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
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const students = teacher.assignedStudents.map((s) => ({
			studentId: s._id,
			name: s.userId.name,
			email: s.userId.email,
			phone: s.userId.phone,
			license: s.chosenLicense
				? {
						name: s.chosenLicense.name,
						price: s.chosenLicense.price,
				  }
				: null,
			theoPassed: s.theoPassed,
			practicalProgress: s.practicalProgress,
			status: s.status,
		}));

		return {
			count: students.length,
			students,
		};
	}

	// Create theoretical schedule (weekly recurring)
	async createSchedule(userId, courseId, weeklySlots, location) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		// Validate weeklySlots
		if (!weeklySlots || weeklySlots.length !== 3) {
			throw new Error("You must provide exactly 3 weekly time slots");
		}

		// Check if teacher already has a schedule for this course
		const existingSchedule = await teacherRepo.getScheduleByCourse(
			teacher._id,
			courseId
		);
		if (existingSchedule) {
			throw new Error(
				"You already have a schedule for this course. Update or delete it first."
			);
		}

		const schedule = await teacherRepo.createTheoSchedule({
			teacherId: teacher._id,
			courseId,
			weeklySlots,
			location,
			isActive: true,
		});

		return {
			message: "Weekly schedule created successfully",
			schedule: {
				scheduleId: schedule._id,
				courseId: schedule.courseId,
				weeklySlots: schedule.weeklySlots,
				location: schedule.location,
				isActive: schedule.isActive,
			},
		};
	}

	// Get all schedules for teacher
	async getSchedules(userId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const schedules = await teacherRepo.getTeacherSchedules(teacher._id);

		return {
			count: schedules.length,
			schedules: schedules.map((s) => ({
				scheduleId: s._id,
				courseId: s.courseId,
				weeklySlots: s.weeklySlots,
				location: s.location,
				isActive: s.isActive,
				assignedStudentsCount: s.assignedStudents
					? s.assignedStudents.length
					: 0,
			})),
		};
	}

	// Mark student as ready for theoretical exam
	async markStudentReadyForExam(userId, studentId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		// Check if student is assigned to this teacher
		const isAssigned = teacher.assignedStudents.some(
			(s) => s._id.toString() === studentId
		);

		if (!isAssigned) {
			throw new Error("This student is not assigned to you");
		}

		// Get student details
		const student = await teacherRepo.getStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		if (student.theoPassed) {
			throw new Error("Student has already passed the theoretical exam");
		}

		// Get attendance statistics
		const attendanceStats = await teacherRepo.getStudentAttendanceStats(
			studentId,
			teacher._id,
			student.chosenLicense._id
		);

		// Check minimum requirements
		const minAttendanceRate = 80; // 80% minimum
		const minLectures = 10; // Minimum 10 lectures attended

		if (attendanceStats.attendanceRate < minAttendanceRate) {
			throw new Error(
				`Student attendance rate is ${attendanceStats.attendanceRate}%. Minimum required: ${minAttendanceRate}%`
			);
		}

		if (attendanceStats.attended < minLectures) {
			throw new Error(
				`Student has attended ${attendanceStats.attended} lectures. Minimum required: ${minLectures}`
			);
		}

		// Mark student as ready
		await teacherRepo.markStudentReadyForTheoExam(studentId);

		return {
			message: "Student marked as ready for theoretical exam",
			studentId: studentId,
			studentName: student.userId.name,
			attendanceStats,
		};
	}

	// ============ LECTURE MANAGEMENT ============

	// Create a new lecture
	async createLecture(userId, lectureData) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const { scheduleId, date, topic, description } = lectureData;

		// Validate schedule belongs to teacher
		const schedule = await teacherRepo.getScheduleById(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		if (schedule.teacherId.toString() !== teacher._id.toString()) {
			throw new Error("This schedule does not belong to you");
		}

		// Determine which weekly slot this lecture is for
		const lectureDate = new Date(date);
		const dayNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const dayName = dayNames[lectureDate.getDay()];

		const weeklySlot = schedule.weeklySlots.find((slot) => slot.day === dayName);
		if (!weeklySlot) {
			throw new Error(`No weekly slot found for ${dayName}`);
		}

		// Create attendees list from assigned students
		const attendees = schedule.assignedStudents.map((student) => ({
			studentId: student._id,
			status: "absent",
			notes: "",
		}));

		// Create lecture
		const lecture = await teacherRepo.createLecture({
			scheduleId: schedule._id,
			teacherId: teacher._id,
			courseId: schedule.courseId,
			date: lectureDate,
			weeklySlot: {
				day: weeklySlot.day,
				startTime: weeklySlot.startTime,
				endTime: weeklySlot.endTime,
			},
			location: schedule.location,
			topic: topic || "",
			description: description || "",
			status: "scheduled",
			attendees,
			totalEnrolled: attendees.length,
		});

		// Update schedule lecture count
		await teacherRepo.updateScheduleLectureCount(scheduleId, 1);

		return {
			message: "Lecture created successfully",
			lecture: {
				lectureId: lecture._id,
				date: lecture.date,
				topic: lecture.topic,
				location: lecture.location,
				totalStudents: lecture.totalEnrolled,
			},
		};
	}

	// Get all lectures for teacher
	async getLectures(userId, filters = {}) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lectures = await teacherRepo.getTeacherLectures(teacher._id, filters);

		return {
			count: lectures.length,
			lectures: lectures.map((l) => ({
				lectureId: l._id,
				courseName: l.courseId.name,
				date: l.date,
				weeklySlot: l.weeklySlot,
				location: l.location,
				topic: l.topic,
				status: l.status,
				totalEnrolled: l.totalEnrolled,
				presentCount: l.presentCount,
				attendanceRate: l.attendanceRate,
			})),
		};
	}

	// Get today's lectures
	async getTodayLectures(userId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lectures = await teacherRepo.getTodayLectures(teacher._id);

		return {
			count: lectures.length,
			lectures: lectures.map((l) => ({
				lectureId: l._id,
				courseName: l.courseId.name,
				date: l.date,
				weeklySlot: l.weeklySlot,
				location: l.location,
				topic: l.topic,
				status: l.status,
				totalEnrolled: l.totalEnrolled,
				presentCount: l.presentCount,
				attendanceRate: l.attendanceRate,
			})),
		};
	}

	// Get upcoming lectures
	async getUpcomingLectures(userId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lectures = await teacherRepo.getUpcomingLectures(teacher._id);

		return {
			count: lectures.length,
			lectures: lectures.map((l) => ({
				lectureId: l._id,
				courseName: l.courseId.name,
				date: l.date,
				weeklySlot: l.weeklySlot,
				location: l.location,
				topic: l.topic,
				status: l.status,
			})),
		};
	}

	// Get lecture details
	async getLectureDetails(userId, lectureId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lecture = await teacherRepo.getLectureById(lectureId);
		if (!lecture) {
			throw new Error("Lecture not found");
		}

		// Verify lecture belongs to teacher
		if (lecture.teacherId.toString() !== teacher._id.toString()) {
			throw new Error("This lecture does not belong to you");
		}

		return {
			lectureId: lecture._id,
			courseId: lecture.courseId._id,
			courseName: lecture.courseId.name,
			scheduleId: lecture.scheduleId._id,
			date: lecture.date,
			weeklySlot: lecture.weeklySlot,
			location: lecture.location,
			topic: lecture.topic,
			description: lecture.description,
			status: lecture.status,
			attendees: lecture.attendees.map((a) => ({
				studentId: a.studentId._id,
				studentName: a.studentId.userId.name,
				studentEmail: a.studentId.userId.email,
				status: a.status,
				checkInTime: a.checkInTime,
				notes: a.notes,
			})),
			totalEnrolled: lecture.totalEnrolled,
			presentCount: lecture.presentCount,
			absentCount: lecture.absentCount,
			lateCount: lecture.lateCount,
			attendanceRate: lecture.attendanceRate,
			lectureNotes: lecture.lectureNotes,
		};
	}

	// Mark attendance for a lecture
	async markAttendance(userId, lectureId, attendanceData) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lecture = await teacherRepo.getLectureById(lectureId);
		if (!lecture) {
			throw new Error("Lecture not found");
		}

		// Verify lecture belongs to teacher
		if (lecture.teacherId.toString() !== teacher._id.toString()) {
			throw new Error("This lecture does not belong to you");
		}

		// Validate attendance data
		if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
			throw new Error("Attendance data must be a non-empty array");
		}

		// Mark attendance
		const updatedLecture = await teacherRepo.markLectureAttendance(
			lectureId,
			attendanceData
		);

		// Update student records
		for (const att of attendanceData) {
			if (att.status === "present" || att.status === "late") {
				const stats = await teacherRepo.getStudentAttendanceStats(
					att.studentId,
					teacher._id,
					lecture.courseId
				);
				await teacherRepo.updateStudentTheoProgress(att.studentId, stats);
			}
		}

		return {
			message: "Attendance marked successfully",
			lectureId: updatedLecture._id,
			presentCount: updatedLecture.presentCount,
			absentCount: updatedLecture.absentCount,
			attendanceRate: updatedLecture.attendanceRate,
		};
	}

	// Update lecture details
	async updateLecture(userId, lectureId, updates) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lecture = await teacherRepo.getLectureById(lectureId);
		if (!lecture) {
			throw new Error("Lecture not found");
		}

		// Verify lecture belongs to teacher
		if (lecture.teacherId.toString() !== teacher._id.toString()) {
			throw new Error("This lecture does not belong to you");
		}

		const updatedLecture = await teacherRepo.updateLecture(lectureId, updates);

		return {
			message: "Lecture updated successfully",
			lecture: {
				lectureId: updatedLecture._id,
				topic: updatedLecture.topic,
				description: updatedLecture.description,
				lectureNotes: updatedLecture.lectureNotes,
			},
		};
	}

	// Cancel a lecture
	async cancelLecture(userId, lectureId, reason) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		const lecture = await teacherRepo.getLectureById(lectureId);
		if (!lecture) {
			throw new Error("Lecture not found");
		}

		// Verify lecture belongs to teacher
		if (lecture.teacherId.toString() !== teacher._id.toString()) {
			throw new Error("This lecture does not belong to you");
		}

		if (!reason || reason.trim() === "") {
			throw new Error("Cancellation reason is required");
		}

		await teacherRepo.cancelLecture(lectureId, reason);

		return {
			message: "Lecture cancelled successfully",
			lectureId,
		};
	}

	// Get student details with attendance
	async getStudentDetails(userId, studentId) {
		const teacher = await teacherRepo.getTeacherByUserId(userId);
		if (!teacher) {
			throw new Error("Teacher profile not found");
		}

		// Check if student is assigned to this teacher
		const isAssigned = teacher.assignedStudents.some(
			(s) => s._id.toString() === studentId
		);

		if (!isAssigned) {
			throw new Error("This student is not assigned to you");
		}

		const student = await teacherRepo.getStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		// Get attendance statistics
		const attendanceStats = await teacherRepo.getStudentAttendanceStats(
			studentId,
			teacher._id,
			student.chosenLicense._id
		);

		// Get lecture history
		const lectureHistory = await teacherRepo.getStudentLectureHistory(
			studentId,
			teacher._id
		);

		return {
			studentId: student._id,
			name: student.userId.name,
			email: student.userId.email,
			phone: student.userId.phone,
			license: student.chosenLicense
				? {
						name: student.chosenLicense.name,
						minPracticalSessions:
							student.chosenLicense.minPracticalSessions,
				  }
				: null,
			theoPassed: student.theoPassed,
			readyForTheoExam: student.readyForTheoExam,
			attendanceStats,
			recentLectures: lectureHistory.slice(0, 10).map((l) => ({
				date: l.date,
				topic: l.topic,
				status:
					l.attendees.find((a) => a.studentId.toString() === studentId)
						?.status || "absent",
			})),
		};
	}
}

module.exports = new TeacherService();
