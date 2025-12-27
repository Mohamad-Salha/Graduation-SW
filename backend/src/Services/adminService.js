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

	// Mark student as passed theoretical exam (direct method)
	async markStudentTheoPassed(studentId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		if (!student.readyForTheoExam) {
			throw new Error("Student is not ready for theoretical exam");
		}

		if (student.theoPassed) {
			throw new Error("Student already passed theoretical exam");
		}

		await adminRepo.markStudentTheoPassed(studentId);

		return {
			message: "Student marked as passed theoretical exam",
			studentId,
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

	// === Vehicle Management ===

	// Create vehicle
	async createVehicle({ model, licensePlate, type }) {
		const vehicle = await adminRepo.createVehicle({
			model,
			licensePlate,
			type: type || "sedan",
			isAvailable: true,
		});

		return {
			message: "Vehicle created successfully",
			vehicle: {
				vehicleId: vehicle._id,
				model: vehicle.model,
				licensePlate: vehicle.licensePlate,
				type: vehicle.type,
			},
		};
	}

	// Get all vehicles
	async getAllVehicles() {
		const vehicles = await adminRepo.getAllVehicles();
		return {
			count: vehicles.length,
			vehicles: vehicles.map((v) => ({
				vehicleId: v._id,
				model: v.model,
				licensePlate: v.licensePlate,
				type: v.type,
				isAvailable: v.isAvailable,
				assignedTrainer:
					v.assignedTrainerId?.userId?.name || "Unassigned",
			})),
		};
	}

	// Assign vehicle to trainer
	async assignVehicleToTrainer(vehicleId, trainerId) {
		const vehicle = await adminRepo.getVehicleById(vehicleId);
		if (!vehicle) {
			throw new Error("Vehicle not found");
		}

		const trainer = await adminRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		await adminRepo.assignVehicleToTrainer(vehicleId, trainerId);

		return {
			message: "Vehicle assigned to trainer successfully",
			vehicleId,
			trainerId,
		};
	}

	// === Dashboard Analytics ===

	// Get dashboard statistics
	async getDashboardStats() {
		const stats = await adminRepo.getDashboardStats();
		return {
			message: "Dashboard statistics retrieved successfully",
			stats,
		};
	}

	// Get recent activities
	async getRecentActivities(limit = 10) {
		const activities = await adminRepo.getRecentActivities(limit);
		return {
			message: "Recent activities retrieved successfully",
			activities,
		};
	}

	// Get revenue analytics
	async getRevenueAnalytics(startDate, endDate) {
		const analytics = await adminRepo.getRevenueAnalytics(startDate, endDate);
		return {
			message: "Revenue analytics retrieved successfully",
			analytics,
		};
	}

	// === Enhanced Student Management ===

	// Get student details
	async getStudentDetails(studentId) {
		const student = await adminRepo.getStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		const payments = await adminRepo.getStudentPayments(studentId);

		return {
			message: "Student details retrieved successfully",
			student: {
				studentId: student._id,
				name: student.userId.name,
				email: student.userId.email,
				phone: student.userId.phone,
				status: student.status,
				chosenLicense: student.chosenLicense,
				teacher: student.theoTeacherId
					? {
							id: student.theoTeacherId._id,
							name: student.theoTeacherId.userId.name,
					  }
					: null,
				trainer: student.trainerId
					? {
							id: student.trainerId._id,
							name: student.trainerId.userId.name,
					  }
					: null,
				progress: {
					theoPassed: student.theoPassed,
					readyForTheoExam: student.readyForTheoExam,
					readyForPracticalExam: student.readyForPracticalExam,
					practicalSessionsCompleted: student.practicalSessionsCompleted,
					theoLecturesAttended: student.theoLecturesAttended || 0,
					theoAttendanceRate: student.theoAttendanceRate || 0,
				},
				payments: payments.map((p) => ({
					paymentId: p._id,
					amount: p.amount,
					status: p.status,
					paymentType: p.paymentType,
					date: p.createdAt,
				})),
				createdAt: student.userId.createdAt,
			},
		};
	}

	// Assign teacher to student
	async assignTeacherToStudent(studentId, teacherId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		const teacher = await adminRepo.getTeacherById(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		await adminRepo.assignTeacherToStudent(studentId, teacherId);

		return {
			message: "Teacher assigned to student successfully",
			studentId,
			teacherId,
		};
	}

	// Assign trainer to student
	async assignTrainerToStudent(studentId, trainerId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		const trainer = await adminRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		await adminRepo.assignTrainerToStudent(studentId, trainerId);

		return {
			message: "Trainer assigned to student successfully",
			studentId,
			trainerId,
		};
	}

	// Update student
	async updateStudent(studentId, updateData) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		const updated = await adminRepo.updateStudent(studentId, updateData);

		return {
			message: "Student updated successfully",
			student: updated,
		};
	}

	// Delete student
	async deleteStudent(studentId) {
		const student = await adminRepo.findStudentById(studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		await adminRepo.deleteStudent(studentId);

		return {
			message: "Student deleted successfully",
			studentId,
		};
	}

	// === Enhanced Teacher Management ===

	// Get teacher details
	async getTeacherDetails(teacherId) {
		const teacher = await adminRepo.getTeacherById(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		return {
			message: "Teacher details retrieved successfully",
			teacher,
		};
	}

	// Update teacher
	async updateTeacher(teacherId, updateData) {
		const teacher = await adminRepo.getTeacherById(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		const updated = await adminRepo.updateTeacher(teacherId, updateData);

		return {
			message: "Teacher updated successfully",
			teacher: updated,
		};
	}

	// Delete teacher
	async deleteTeacher(teacherId) {
		const teacher = await adminRepo.getTeacherById(teacherId);
		if (!teacher) {
			throw new Error("Teacher not found");
		}

		await adminRepo.deleteTeacher(teacherId);

		return {
			message: "Teacher deleted successfully",
			teacherId,
		};
	}

	// === Enhanced Trainer Management ===

	// Get trainer details
	async getTrainerDetails(trainerId) {
		const trainer = await adminRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		return {
			message: "Trainer details retrieved successfully",
			trainer,
		};
	}

	// Update trainer
	async updateTrainer(trainerId, updateData) {
		const trainer = await adminRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		const updated = await adminRepo.updateTrainer(trainerId, updateData);

		return {
			message: "Trainer updated successfully",
			trainer: updated,
		};
	}

	// Delete trainer
	async deleteTrainer(trainerId) {
		const trainer = await adminRepo.getTrainerById(trainerId);
		if (!trainer) {
			throw new Error("Trainer not found");
		}

		await adminRepo.deleteTrainer(trainerId);

		return {
			message: "Trainer deleted successfully",
			trainerId,
		};
	}

	// === Enhanced Vehicle Management ===

	// Update vehicle
	async updateVehicle(vehicleId, updateData) {
		const vehicle = await adminRepo.getVehicleById(vehicleId);
		if (!vehicle) {
			throw new Error("Vehicle not found");
		}

		const updated = await adminRepo.updateVehicle(vehicleId, updateData);

		return {
			message: "Vehicle updated successfully",
			vehicle: updated,
		};
	}

	// Delete vehicle
	async deleteVehicle(vehicleId) {
		const vehicle = await adminRepo.getVehicleById(vehicleId);
		if (!vehicle) {
			throw new Error("Vehicle not found");
		}

		await adminRepo.deleteVehicle(vehicleId);

		return {
			message: "Vehicle deleted successfully",
			vehicleId,
		};
	}

	// Add maintenance record
	async addMaintenanceRecord(vehicleId, maintenanceData) {
		const vehicle = await adminRepo.getVehicleById(vehicleId);
		if (!vehicle) {
			throw new Error("Vehicle not found");
		}

		const updated = await adminRepo.addMaintenanceRecord(
			vehicleId,
			maintenanceData
		);

		return {
			message: "Maintenance record added successfully",
			vehicle: updated,
		};
	}

	// === Enhanced License Management ===

	// Update license
	async updateLicense(licenseId, updateData) {
		const license = await adminRepo.getLicenseById(licenseId);
		if (!license) {
			throw new Error("License not found");
		}

		const updated = await adminRepo.updateLicense(licenseId, updateData);

		return {
			message: "License updated successfully",
			license: updated,
		};
	}

	// Delete license
	async deleteLicense(licenseId) {
		const license = await adminRepo.getLicenseById(licenseId);
		if (!license) {
			throw new Error("License not found");
		}

		await adminRepo.deleteLicense(licenseId);

		return {
			message: "License deleted successfully",
			licenseId,
		};
	}

	// === Payment Management ===

	// Get all payments
	async getAllPayments(filters) {
		const payments = await adminRepo.getAllPayments(filters);
		return {
			message: "Payments retrieved successfully",
			count: payments.length,
			payments: payments.map((p) => ({
				paymentId: p._id,
				student: {
					id: p.studentId._id,
					name: p.studentId.userId.name,
					email: p.studentId.userId.email,
				},
				amount: p.amount,
				status: p.status,
				paymentType: p.paymentType,
				paymentMethod: p.paymentMethod,
				invoiceNumber: p.invoiceNumber,
				createdAt: p.createdAt,
			})),
		};
	}

	// Create payment record
	async createPayment(paymentData) {
		const student = await adminRepo.findStudentById(paymentData.studentId);
		if (!student) {
			throw new Error("Student not found");
		}

		// Generate invoice number if not provided
		if (!paymentData.invoiceNumber) {
			const count = await adminRepo.getAllPayments({});
			paymentData.invoiceNumber = `INV-${Date.now()}-${count.length + 1}`;
		}

		const payment = await adminRepo.createPayment(paymentData);

		return {
			message: "Payment recorded successfully",
			payment,
		};
	}

	// Update payment
	async updatePayment(paymentId, updateData) {
		const payment = await adminRepo.getPaymentById(paymentId);
		if (!payment) {
			throw new Error("Payment not found");
		}

		const updated = await adminRepo.updatePayment(paymentId, updateData);

		return {
			message: "Payment updated successfully",
			payment: updated,
		};
	}

	// Get payment details
	async getPaymentDetails(paymentId) {
		const payment = await adminRepo.getPaymentById(paymentId);
		if (!payment) {
			throw new Error("Payment not found");
		}

		return {
			message: "Payment details retrieved successfully",
			payment,
		};
	}
}

module.exports = new AdminService();
