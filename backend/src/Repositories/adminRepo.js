const Student = require("../../Database/models/Student");
const User = require("../../Database/models/User");
const License = require("../../Database/models/License");
const Teacher = require("../../Database/models/Teacher");
const Trainer = require("../../Database/models/Trainer");
const Exam = require("../../Database/models/Exam");
const ExamAttempt = require("../../Database/models/ExamAttempt");
const Vehicle = require("../../Database/models/Vehicle");
const Payment = require("../../Database/models/Payment");

class AdminRepository {
	// Get all pending students
	async getPendingStudents() {
		return await Student.find({ status: "pending" }).populate(
			"userId",
			"name email phone createdAt"
		);
	}

	// Get all students
	async getAllStudents() {
		return await Student.find()
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name price")
			.populate({
				path: "theoTeacherId",
				populate: {
					path: "userId",
					select: "name email"
				}
			})
			.populate({
				path: "trainerId",
				populate: {
					path: "userId",
					select: "name email"
				}
			});
	}

	// Find student by ID
	async findStudentById(studentId) {
		return await Student.findById(studentId);
	}

	// Update student status
	async updateStudentStatus(studentId, status) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ status },
			{ new: true }
		);
	}

	// === License Management ===

	// Create new license
	async createLicense(licenseData) {
		const license = new License(licenseData);
		return await license.save();
	}

	// Get all licenses
	async getAllLicenses() {
		return await License.find();
	}

	// === Teacher Management ===

	// Create new teacher (user + teacher profile)
	async createTeacher(userData) {
		const user = new User(userData);
		const savedUser = await user.save();

		const teacher = new Teacher({ userId: savedUser._id });
		await teacher.save();

		return { user: savedUser, teacher };
	}

	// Get all teachers
	async getAllTeachers() {
		return await Teacher.find().populate("userId", "name email phone");
	}

	// === Trainer Management ===

	// Create new trainer (user + trainer profile)
	async createTrainer(userData) {
		const user = new User(userData);
		const savedUser = await user.save();

		const trainer = new Trainer({ userId: savedUser._id });
		await trainer.save();

		return { user: savedUser, trainer };
	}

	// Get all trainers
	async getAllTrainers() {
		return await Trainer.find().populate("userId", "name email phone");
	}

	// === Exam Management ===

	// Create new exam
	async createExam(examData) {
		const exam = new Exam(examData);
		return await exam.save();
	}

	// Get all exams
	async getAllExams() {
		return await Exam.find()
			.populate("courseId", "name description")
			.sort({ date: 1 });
	}

	// Get exam by ID
	async getExamById(examId) {
		return await Exam.findById(examId).populate(
			"courseId",
			"name description"
		);
	}

	// Get students ready for theoretical exam
	async getStudentsReadyForTheoExam() {
		return await Student.find({ readyForTheoExam: true, theoPassed: false })
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name")
			.populate({
				path: "theoTeacherId",
				populate: { path: "userId", select: "name" },
			});
	}

	// Get students ready for practical exam
	async getStudentsReadyForPracticalExam() {
		return await Student.find({
			theoPassed: true,
			readyForPracticalExam: true,
		})
			.populate("userId", "name email phone")
			.populate("chosenLicense", "name")
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name" },
			});
	}

	// Create exam attempt
	async createExamAttempt(examId, studentId, attemptNumber) {
		const attempt = new ExamAttempt({
			examId,
			studentId,
			attemptNumber,
			status: "pending",
		});
		return await attempt.save();
	}

	// Get student's exam attempts
	async getStudentExamAttempts(studentId) {
		return await ExamAttempt.find({ studentId })
			.populate({
				path: "examId",
				populate: { path: "courseId", select: "name" },
			})
			.sort({ date: -1 });
	}

	// Update exam attempt result
	async updateExamAttemptResult(attemptId, status) {
		return await ExamAttempt.findByIdAndUpdate(
			attemptId,
			{ status },
			{ new: true }
		);
	}

	// Get exam attempt by ID
	async getExamAttemptById(attemptId) {
		return await ExamAttempt.findById(attemptId)
			.populate("studentId")
			.populate("examId");
	}

	// Update student - mark theoretical exam as passed
	async markStudentTheoPassed(studentId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoPassed: true, readyForTheoExam: false },
			{ new: true }
		);
	}

	// Get all exam attempts for a specific exam
	async getExamAttempts(examId) {
		return await ExamAttempt.find({ examId })
			.populate("studentId")
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name email phone" },
			})
			.sort({ attemptNumber: 1 });
	}

	// === Vehicle Management ===

	// Create vehicle
	async createVehicle(vehicleData) {
		const vehicle = new Vehicle(vehicleData);
		return await vehicle.save();
	}

	// Get all vehicles
	async getAllVehicles() {
		return await Vehicle.find().populate({
			path: "assignedTrainerId",
			populate: { path: "userId", select: "name" },
		});
	}

	// Assign vehicle to trainer
	async assignVehicleToTrainer(vehicleId, trainerId) {
		return await Vehicle.findByIdAndUpdate(
			vehicleId,
			{ assignedTrainerId: trainerId },
			{ new: true }
		);
	}

	// Get vehicle by ID
	async getVehicleById(vehicleId) {
		return await Vehicle.findById(vehicleId);
	}

	// Update vehicle
	async updateVehicle(vehicleId, updateData) {
		return await Vehicle.findByIdAndUpdate(vehicleId, updateData, {
			new: true,
		});
	}

	// Delete vehicle
	async deleteVehicle(vehicleId) {
		return await Vehicle.findByIdAndDelete(vehicleId);
	}

	// Add maintenance record to vehicle
	async addMaintenanceRecord(vehicleId, maintenanceData) {
		return await Vehicle.findByIdAndUpdate(
			vehicleId,
			{
				$push: { maintenanceRecords: maintenanceData },
				lastMaintenanceDate: maintenanceData.date,
				nextMaintenanceDate: maintenanceData.nextMaintenanceDate,
			},
			{ new: true }
		);
	}

	// === Dashboard Statistics ===

	// Get dashboard KPIs
	async getDashboardStats() {
		const [
			totalStudents,
			pendingStudents,
			activeStudents,
			totalTeachers,
			totalTrainers,
			totalVehicles,
			availableVehicles,
			totalPayments,
			completedPayments,
			pendingPayments,
			readyForTheoExam,
			readyForPracticalExam,
		] = await Promise.all([
			Student.countDocuments(),
			Student.countDocuments({ status: "pending" }),
			Student.countDocuments({ status: "approved" }),
			Teacher.countDocuments(),
			Trainer.countDocuments(),
			Vehicle.countDocuments(),
			Vehicle.countDocuments({ isAvailable: true, status: "active" }),
			Payment.countDocuments(),
			Payment.countDocuments({ status: "completed" }),
			Payment.countDocuments({ status: "pending" }),
			Student.countDocuments({ readyForTheoExam: true, theoPassed: false }),
			Student.countDocuments({ theoPassed: true, readyForPracticalExam: true }),
		]);

		const totalRevenue = await Payment.aggregate([
			{ $match: { status: "completed" } },
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		const monthlyRevenue = await Payment.aggregate([
			{
				$match: {
					status: "completed",
					createdAt: {
						$gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
					},
				},
			},
			{ $group: { _id: null, total: { $sum: "$amount" } } },
		]);

		return {
			students: {
				total: totalStudents,
				pending: pendingStudents,
				active: activeStudents,
			},
			staff: {
				teachers: totalTeachers,
				trainers: totalTrainers,
			},
			vehicles: {
				total: totalVehicles,
				available: availableVehicles,
			},
			payments: {
				total: totalPayments,
				completed: completedPayments,
				pending: pendingPayments,
			},
			exams: {
				readyForTheo: readyForTheoExam,
				readyForPractical: readyForPracticalExam,
			},
			revenue: {
				total: totalRevenue[0]?.total || 0,
				monthly: monthlyRevenue[0]?.total || 0,
			},
		};
	}

	// Get recent activities
	async getRecentActivities(limit = 10) {
		const recentStudents = await Student.find()
			.populate("userId", "name email createdAt")
			.sort({ createdAt: -1 })
			.limit(limit);

		const recentPayments = await Payment.find()
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name" },
			})
			.sort({ createdAt: -1 })
			.limit(limit);

		return {
			students: recentStudents,
			payments: recentPayments,
		};
	}

	// Get revenue analytics
	async getRevenueAnalytics(startDate, endDate) {
		const match = { status: "completed" };
		if (startDate && endDate) {
			match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
		}

		const dailyRevenue = await Payment.aggregate([
			{ $match: match },
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
						day: { $dayOfMonth: "$createdAt" },
					},
					total: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
		]);

		const byPaymentType = await Payment.aggregate([
			{ $match: match },
			{
				$group: {
					_id: "$paymentType",
					total: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]);

		return {
			daily: dailyRevenue,
			byType: byPaymentType,
		};
	}

	// === License Management ===

	// Update license
	async updateLicense(licenseId, updateData) {
		return await License.findByIdAndUpdate(licenseId, updateData, {
			new: true,
		});
	}

	// Delete license
	async deleteLicense(licenseId) {
		return await License.findByIdAndDelete(licenseId);
	}

	// Get license by ID
	async getLicenseById(licenseId) {
		return await License.findById(licenseId);
	}

	// === Teacher Management Enhanced ===

	// Update teacher
	async updateTeacher(teacherId, updateData) {
		return await Teacher.findByIdAndUpdate(teacherId, updateData, {
			new: true,
		});
	}

	// Delete teacher
	async deleteTeacher(teacherId) {
		// First delete the teacher document
		const teacher = await Teacher.findByIdAndDelete(teacherId);
		// Then delete associated user
		if (teacher && teacher.userId) {
			await User.findByIdAndDelete(teacher.userId);
		}
		return teacher;
	}

	// Get teacher by ID with students
	async getTeacherById(teacherId) {
		const teacher = await Teacher.findById(teacherId).populate(
			"userId",
			"name email phone"
		);

		const assignedStudents = await Student.find({
			theoTeacherId: teacherId,
		}).populate("userId", "name email");

		return {
			...teacher.toObject(),
			assignedStudents,
		};
	}

	// === Trainer Management Enhanced ===

	// Update trainer
	async updateTrainer(trainerId, updateData) {
		return await Trainer.findByIdAndUpdate(trainerId, updateData, {
			new: true,
		});
	}

	// Delete trainer
	async deleteTrainer(trainerId) {
		// First delete the trainer document
		const trainer = await Trainer.findByIdAndDelete(trainerId);
		// Then delete associated user
		if (trainer && trainer.userId) {
			await User.findByIdAndDelete(trainer.userId);
		}
		return trainer;
	}

	// Get trainer by ID with students
	async getTrainerById(trainerId) {
		const trainer = await Trainer.findById(trainerId).populate(
			"userId",
			"name email phone"
		);

		const assignedStudents = await Student.find({
			trainerId: trainerId,
		}).populate("userId", "name email");

		const assignedVehicle = await Vehicle.findOne({
			assignedTrainerId: trainerId,
		});

		return {
			...trainer.toObject(),
			assignedStudents,
			assignedVehicle,
		};
	}

	// === Student Management Enhanced ===

	// Get student by ID with full details
	async getStudentById(studentId) {
		return await Student.findById(studentId)
			.populate("userId", "name email phone createdAt")
			.populate("chosenLicense", "name price minPracticalSessions")
			.populate({
				path: "theoTeacherId",
				populate: { path: "userId", select: "name" },
			})
			.populate({
				path: "trainerId",
				populate: { path: "userId", select: "name" },
			});
	}

	// Assign teacher to student
	async assignTeacherToStudent(studentId, teacherId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ theoTeacherId: teacherId },
			{ new: true }
		);
	}

	// Assign trainer to student
	async assignTrainerToStudent(studentId, trainerId) {
		return await Student.findByIdAndUpdate(
			studentId,
			{ trainerId: trainerId },
			{ new: true }
		);
	}

	// Update student
	async updateStudent(studentId, updateData) {
		return await Student.findByIdAndUpdate(studentId, updateData, {
			new: true,
		});
	}

	// Delete student
	async deleteStudent(studentId) {
		const student = await Student.findByIdAndDelete(studentId);
		// Optionally delete associated user
		if (student && student.userId) {
			await User.findByIdAndDelete(student.userId);
		}
		return student;
	}

	// Get student's payment history
	async getStudentPayments(studentId) {
		return await Payment.find({ studentId })
			.sort({ createdAt: -1 })
			.populate("recordedBy", "name");
	}

	// === Payment Management ===

	// Get all payments with filters
	async getAllPayments(filters = {}) {
		const query = {};
		if (filters.status) query.status = filters.status;
		if (filters.paymentType) query.paymentType = filters.paymentType;
		if (filters.studentId) query.studentId = filters.studentId;

		return await Payment.find(query)
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("recordedBy", "name")
			.sort({ createdAt: -1 });
	}

	// Create payment record
	async createPayment(paymentData) {
		const payment = new Payment(paymentData);
		return await payment.save();
	}

	// Update payment
	async updatePayment(paymentId, updateData) {
		return await Payment.findByIdAndUpdate(paymentId, updateData, {
			new: true,
		});
	}

	// Get payment by ID
	async getPaymentById(paymentId) {
		return await Payment.findById(paymentId)
			.populate({
				path: "studentId",
				populate: { path: "userId", select: "name email phone" },
			})
			.populate("recordedBy", "name")
			.populate("verifiedBy", "name");
	}
}

module.exports = new AdminRepository();
