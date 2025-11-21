const adminRepo = require("../Repositories/adminRepo");

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
}

module.exports = new AdminService();
