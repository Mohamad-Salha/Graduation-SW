const adminService = require("../Services/adminService");

class AdminController {
	// GET /api/admin/students/pending
	async getPendingStudents(req, res) {
		try {
			const result = await adminService.getPendingStudents();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/students
	async getAllStudents(req, res) {
		try {
			const result = await adminService.getAllStudents();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/approve
	async approveStudent(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.approveStudent(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/reject
	async rejectStudent(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.rejectStudent(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === License Management ===

	// POST /api/admin/licenses
	async createLicense(req, res) {
		try {
			const { name, description, minPracticalSessions, price } = req.body;

			if (!name || !price) {
				return res
					.status(400)
					.json({ error: "Name and price are required" });
			}

			const result = await adminService.createLicense(
				name,
				description,
				minPracticalSessions,
				price
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/licenses
	async getAllLicenses(req, res) {
		try {
			const result = await adminService.getAllLicenses();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Teacher Management ===

	// POST /api/admin/teachers
	async createTeacher(req, res) {
		try {
			const { name, email, password, phone } = req.body;

			if (!name || !email || !password) {
				return res
					.status(400)
					.json({ error: "Name, email, and password are required" });
			}

			const result = await adminService.createTeacher(
				name,
				email,
				password,
				phone
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/teachers
	async getAllTeachers(req, res) {
		try {
			const result = await adminService.getAllTeachers();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Trainer Management ===

	// POST /api/admin/trainers
	async createTrainer(req, res) {
		try {
			const { name, email, password, phone } = req.body;

			if (!name || !email || !password) {
				return res
					.status(400)
					.json({ error: "Name, email, and password are required" });
			}

			const result = await adminService.createTrainer(
				name,
				email,
				password,
				phone
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/trainers
	async getAllTrainers(req, res) {
		try {
			const result = await adminService.getAllTrainers();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Exam Management ===

	// POST /api/admin/exams/theoretical
	async scheduleTheoricalExam(req, res) {
		try {
			const { courseId, date, location } = req.body;
			const result = await adminService.scheduleTheoricalExam({
				courseId,
				date,
				location,
			});
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/admin/exams/practical
	async schedulePracticalExam(req, res) {
		try {
			const { courseId, date, location } = req.body;
			const result = await adminService.schedulePracticalExam({
				courseId,
				date,
				location,
			});
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/exams
	async getAllExams(req, res) {
		try {
			const result = await adminService.getAllExams();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/students/ready-theo
	async getStudentsReadyForTheoExam(req, res) {
		try {
			const result = await adminService.getStudentsReadyForTheoExam();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/students/ready-practical
	async getStudentsReadyForPracticalExam(req, res) {
		try {
			const result =
				await adminService.getStudentsReadyForPracticalExam();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/theo-pass
	async markStudentTheoPassed(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.markStudentTheoPassed(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/exam-attempts/:attemptId/result
	async recordExamResult(req, res) {
		try {
			const { attemptId } = req.params;
			const { status } = req.body;
			const result = await adminService.recordExamResult(
				attemptId,
				status
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/exams/:examId/attempts
	// GET /api/admin/exams/:examId/attempts
	async getExamAttempts(req, res) {
		try {
			const { examId } = req.params;
			const result = await adminService.getExamAttempts(examId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Vehicle Management ===

	// POST /api/admin/vehicles
	async createVehicle(req, res) {
		try {
			const { model, licensePlate, type } = req.body;

			if (!model || !licensePlate) {
				return res.status(400).json({
					error: "Model and license plate are required",
				});
			}

			const result = await adminService.createVehicle({
				model,
				licensePlate,
				type,
			});
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/vehicles
	async getAllVehicles(req, res) {
		try {
			const result = await adminService.getAllVehicles();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/vehicles/:vehicleId/assign
	async assignVehicleToTrainer(req, res) {
		try {
			const { vehicleId } = req.params;
			const { trainerId } = req.body;

			if (!trainerId) {
				return res
					.status(400)
					.json({ error: "Trainer ID is required" });
			}

			const result = await adminService.assignVehicleToTrainer(
				vehicleId,
				trainerId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Dashboard Analytics ===

	// GET /api/admin/dashboard/stats
	async getDashboardStats(req, res) {
		try {
			const result = await adminService.getDashboardStats();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/dashboard/activities
	async getRecentActivities(req, res) {
		try {
			const { limit } = req.query;
			const result = await adminService.getRecentActivities(
				limit ? parseInt(limit) : 10
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/dashboard/revenue
	async getRevenueAnalytics(req, res) {
		try {
			const { startDate, endDate } = req.query;
			const result = await adminService.getRevenueAnalytics(
				startDate,
				endDate
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Enhanced Student Management ===

	// GET /api/admin/students/:studentId
	async getStudentDetails(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.getStudentDetails(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/assign-teacher
	async assignTeacherToStudent(req, res) {
		try {
			const { studentId } = req.params;
			const { teacherId } = req.body;

			if (!teacherId) {
				return res
					.status(400)
					.json({ error: "Teacher ID is required" });
			}

			const result = await adminService.assignTeacherToStudent(
				studentId,
				teacherId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/assign-trainer
	async assignTrainerToStudent(req, res) {
		try {
			const { studentId } = req.params;
			const { trainerId } = req.body;

			if (!trainerId) {
				return res
					.status(400)
					.json({ error: "Trainer ID is required" });
			}

			const result = await adminService.assignTrainerToStudent(
				studentId,
				trainerId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId
	async updateStudent(req, res) {
		try {
			const { studentId } = req.params;
			const updateData = req.body;

			const result = await adminService.updateStudent(
				studentId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// DELETE /api/admin/students/:studentId
	async deleteStudent(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.deleteStudent(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Enhanced Teacher Management ===

	// GET /api/admin/teachers/:teacherId
	async getTeacherDetails(req, res) {
		try {
			const { teacherId } = req.params;
			const result = await adminService.getTeacherDetails(teacherId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/teachers/:teacherId
	async updateTeacher(req, res) {
		try {
			const { teacherId } = req.params;
			const updateData = req.body;

			const result = await adminService.updateTeacher(
				teacherId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// DELETE /api/admin/teachers/:teacherId
	async deleteTeacher(req, res) {
		try {
			const { teacherId } = req.params;
			const result = await adminService.deleteTeacher(teacherId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Enhanced Trainer Management ===

	// GET /api/admin/trainers/:trainerId
	async getTrainerDetails(req, res) {
		try {
			const { trainerId } = req.params;
			const result = await adminService.getTrainerDetails(trainerId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/trainers/:trainerId
	async updateTrainer(req, res) {
		try {
			const { trainerId } = req.params;
			const updateData = req.body;

			const result = await adminService.updateTrainer(
				trainerId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// DELETE /api/admin/trainers/:trainerId
	async deleteTrainer(req, res) {
		try {
			const { trainerId } = req.params;
			const result = await adminService.deleteTrainer(trainerId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Enhanced Vehicle Management ===

	// PUT /api/admin/vehicles/:vehicleId
	async updateVehicle(req, res) {
		try {
			const { vehicleId } = req.params;
			const updateData = req.body;

			const result = await adminService.updateVehicle(
				vehicleId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// DELETE /api/admin/vehicles/:vehicleId
	async deleteVehicle(req, res) {
		try {
			const { vehicleId } = req.params;
			const result = await adminService.deleteVehicle(vehicleId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/admin/vehicles/:vehicleId/maintenance
	async addMaintenanceRecord(req, res) {
		try {
			const { vehicleId } = req.params;
			const maintenanceData = req.body;

			const result = await adminService.addMaintenanceRecord(
				vehicleId,
				maintenanceData
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Enhanced License Management ===

	// PUT /api/admin/licenses/:licenseId
	async updateLicense(req, res) {
		try {
			const { licenseId } = req.params;
			const updateData = req.body;

			const result = await adminService.updateLicense(
				licenseId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// DELETE /api/admin/licenses/:licenseId
	async deleteLicense(req, res) {
		try {
			const { licenseId } = req.params;
			const result = await adminService.deleteLicense(licenseId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Payment Management ===

	// GET /api/admin/payments
	async getAllPayments(req, res) {
		try {
			const filters = {
				status: req.query.status,
				paymentType: req.query.paymentType,
				studentId: req.query.studentId,
			};

			const result = await adminService.getAllPayments(filters);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/admin/payments
	async createPayment(req, res) {
		try {
			const paymentData = {
				...req.body,
				recordedBy: req.user.id, // From JWT token
			};

			const result = await adminService.createPayment(paymentData);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/payments/:paymentId
	async updatePayment(req, res) {
		try {
			const { paymentId } = req.params;
			const updateData = req.body;

			const result = await adminService.updatePayment(
				paymentId,
				updateData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/payments/:paymentId
	async getPaymentDetails(req, res) {
		try {
			const { paymentId } = req.params;
			const result = await adminService.getPaymentDetails(paymentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new AdminController();
