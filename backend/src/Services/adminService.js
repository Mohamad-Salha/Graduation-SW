const adminRepo = require("../Repositories/adminRepo");
const bcrypt = require("bcrypt");

class AdminService {
	// Get all pending student requests
	async getPendingStudents() {
		const students = await adminRepo.getPendingStudents();
		return {
			count: students.length,
			students: students.map((s) => ({
				studentId: s._id,
				name: s.userId.name,
				email: s.userId.email,
				phone: s.userId.phone,
				signupDate: s.userId.createdAt,
				status: s.status,
			})),
		};
	}

	// Approve student
	async approveStudent(studentId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		if (student.status !== "pending") {
			throw new Error("Student is not pending approval");
		}

		const updatedStudent = await adminRepo.updateStudentStatus(
			studentId,
			"approved"
		);
		return {
			message: "Student approved successfully",
			studentId: updatedStudent._id,
			status: updatedStudent.status,
		};
	}

	// Reject student
	async rejectStudent(studentId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		if (student.status !== "pending") {
			throw new Error("Student is not pending approval");
		}

		const updatedStudent = await adminRepo.updateStudentStatus(
			studentId,
			"inactive"
		);
		return {
			message: "Student rejected",
			studentId: updatedStudent._id,
			status: updatedStudent.status,
		};
	}

	// Get all students
	async getAllStudents() {
		const students = await adminRepo.getAllStudents();
		return {
			count: students.length,
			students,
		};
	}

	// === License Management ===

	// Create new license
	async createLicense(name, description, minPracticalSessions, price) {
		const license = await adminRepo.createLicense({
			name,
			description,
			minPracticalSessions,
			price,
		});

		return {
			message: "License created successfully",
			license,
		};
	}

	// Get all licenses
	async getAllLicenses() {
		const licenses = await adminRepo.getAllLicenses();
		return {
			count: licenses.length,
			licenses,
		};
	}

	// === Teacher Management ===

	// Create new teacher
	async createTeacher(name, email, password, phone) {
		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await adminRepo.createTeacher({
			name,
			email,
			password: hashedPassword,
			phone,
			role: "teacher",
		});

		return {
			message: "Teacher created successfully",
			teacherId: result.teacher._id,
			userId: result.user._id,
			name: result.user.name,
			email: result.user.email,
		};
	}

	// Get all teachers
	async getAllTeachers() {
		const teachers = await adminRepo.getAllTeachers();
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

	// === Trainer Management ===

	// Create new trainer
	async createTrainer(name, email, password, phone) {
		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await adminRepo.createTrainer({
			name,
			email,
			password: hashedPassword,
			phone,
			role: "trainer",
		});

		return {
			message: "Trainer created successfully",
			trainerId: result.trainer._id,
			userId: result.user._id,
			name: result.user.name,
			email: result.user.email,
		};
	}

	// Get all trainers
	async getAllTrainers() {
		const trainers = await adminRepo.getAllTrainers();
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

	// === Exam Management ===

	// Schedule theoretical exam
	async scheduleTheoricalExam({ courseId, date, location }) {
		const exam = await adminRepo.createExam({
			type: "theoretical",
			courseId,
			date,
			location,
		});

		return {
			message: "Theoretical exam scheduled successfully",
			exam: {
				examId: exam._id,
				type: exam.type,
				courseId: exam.courseId,
				date: exam.date,
				location: exam.location,
			},
		};
	}

	// Schedule practical exam
	async schedulePracticalExam({ courseId, date, location }) {
		const exam = await adminRepo.createExam({
			type: "practical",
			courseId,
			date,
			location,
		});

		return {
			message: "Practical exam scheduled successfully",
			exam: {
				examId: exam._id,
				type: exam.type,
				courseId: exam.courseId,
				date: exam.date,
				location: exam.location,
			},
		};
	}

	// Get all exams
	async getAllExams() {
		const exams = await adminRepo.getAllExams();
		return {
			count: exams.length,
			exams: exams.map((e) => ({
				examId: e._id,
				type: e.type,
				courseName: e.courseId.name,
				courseId: e.courseId._id,
				date: e.date,
				location: e.location,
			})),
		};
	}

	// Get students ready for theoretical exam
	async getStudentsReadyForTheoExam() {
		const students = await adminRepo.getStudentsReadyForTheoExam();
		return {
			count: students.length,
			students: students.map((s) => ({
				studentId: s._id,
				name: s.userId.name,
				email: s.userId.email,
				phone: s.userId.phone,
				license: s.chosenLicense.name,
				teacher: s.theoTeacherId?.userId?.name || "N/A",
			})),
		};
	}

	// Get students ready for practical exam
	async getStudentsReadyForPracticalExam() {
		const students = await adminRepo.getStudentsReadyForPracticalExam();
		return {
			count: students.length,
			students: students.map((s) => ({
				studentId: s._id,
				name: s.userId.name,
				email: s.userId.email,
				phone: s.userId.phone,
				license: s.chosenLicense.name,
				trainer: s.trainerId?.userId?.name || "N/A",
			})),
		};
	}

	// Record exam result
	async recordExamResult(attemptId, status) {
		const attempt = await adminRepo.getExamAttemptById(attemptId);
		if (!attempt) {
			throw new Error("Exam attempt not found");
		}

		if (attempt.status !== "pending") {
			throw new Error("Exam attempt already has a result");
		}

		// Update attempt status
		const updatedAttempt = await adminRepo.updateExamAttemptResult(
			attemptId,
			status
		);

		// If theoretical exam passed, update student
		if (status === "passed") {
			const exam = await adminRepo.getExamById(attempt.examId._id);
			if (exam.type === "theoretical") {
				await adminRepo.markStudentTheoPassed(attempt.studentId._id);
			}
		}

		return {
			message: "Exam result recorded successfully",
			attempt: {
				attemptId: updatedAttempt._id,
				studentId: updatedAttempt.studentId,
				status: updatedAttempt.status,
			},
		};
	}

	// Get exam attempts for specific exam
	async getExamAttempts(examId) {
		const attempts = await adminRepo.getExamAttempts(examId);
		return {
			count: attempts.length,
			attempts: attempts.map((a) => ({
				attemptId: a._id,
				studentName: a.studentId?.userId?.name || "Unknown",
				studentEmail: a.studentId?.userId?.email || "N/A",
				attemptNumber: a.attemptNumber,
				status: a.status,
				date: a.date,
			})),
		};
	}
}

module.exports = new AdminService();
