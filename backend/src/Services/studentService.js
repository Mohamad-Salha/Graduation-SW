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

		return {
			studentId: student._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			status: student.status,
			chosenLicense: student.chosenLicense,
			theoTeacher: student.theoTeacherId,
			trainer: student.trainerId,
			theoPassed: student.theoPassed,
			practicalProgress: student.practicalProgress,
			practicalSessionsCompleted: student.practicalSessionsCompleted,
			courses: student.courses,
		};
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
}

module.exports = new StudentService();
