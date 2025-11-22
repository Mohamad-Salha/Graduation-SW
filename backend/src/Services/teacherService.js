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
			assignedStudentsCount: teacher.assignedStudents.length,
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

		// Mark student as ready
		await teacherRepo.markStudentReadyForTheoExam(studentId);

		return {
			message: "Student marked as ready for theoretical exam",
			studentId: studentId,
			studentName: student.userId.name,
		};
	}
}

module.exports = new TeacherService();
