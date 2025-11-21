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
}

module.exports = new AdminService();
