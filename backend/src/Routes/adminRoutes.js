const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/roleMiddleware");

// Apply authentication and admin role check to all routes
router.use(verifyToken);
router.use(requireRole("admin"));

// GET /api/admin/students/pending - Get all pending student requests
router.get("/students/pending", (req, res) =>
	adminController.getPendingStudents(req, res)
);

// GET /api/admin/students - Get all students
router.get("/students", (req, res) => adminController.getAllStudents(req, res));

// PUT /api/admin/students/:studentId/approve - Approve a student
router.put("/students/:studentId/approve", (req, res) =>
	adminController.approveStudent(req, res)
);

// PUT /api/admin/students/:studentId/reject - Reject a student
router.put("/students/:studentId/reject", (req, res) =>
	adminController.rejectStudent(req, res)
);

// === License Routes ===

// POST /api/admin/licenses - Create a new license
router.post("/licenses", (req, res) => adminController.createLicense(req, res));

// GET /api/admin/licenses - Get all licenses
router.get("/licenses", (req, res) => adminController.getAllLicenses(req, res));

// === Teacher Routes ===

// POST /api/admin/teachers - Create a new teacher
router.post("/teachers", (req, res) => adminController.createTeacher(req, res));

// GET /api/admin/teachers - Get all teachers
router.get("/teachers", (req, res) => adminController.getAllTeachers(req, res));

// === Trainer Routes ===

// POST /api/admin/trainers - Create a new trainer
router.post("/trainers", (req, res) => adminController.createTrainer(req, res));

// GET /api/admin/trainers - Get all trainers
router.get("/trainers", (req, res) => adminController.getAllTrainers(req, res));

// === Exam Routes ===

// POST /api/admin/exams/theoretical - Schedule theoretical exam
router.post("/exams/theoretical", (req, res) =>
	adminController.scheduleTheoricalExam(req, res)
);

// POST /api/admin/exams/practical - Schedule practical exam
router.post("/exams/practical", (req, res) =>
	adminController.schedulePracticalExam(req, res)
);

// GET /api/admin/exams - Get all exams
router.get("/exams", (req, res) => adminController.getAllExams(req, res));

// GET /api/admin/students/ready-theo - Get students ready for theoretical exam
router.get("/students/ready-theo", (req, res) =>
	adminController.getStudentsReadyForTheoExam(req, res)
);

// GET /api/admin/students/ready-practical - Get students ready for practical exam
router.get("/students/ready-practical", (req, res) =>
	adminController.getStudentsReadyForPracticalExam(req, res)
);

// PUT /api/admin/students/:studentId/theo-pass - Mark student as passed theoretical exam
router.put("/students/:studentId/theo-pass", (req, res) =>
	adminController.markStudentTheoPassed(req, res)
);

// PUT /api/admin/exam-attempts/:attemptId/result - Record exam result
router.put("/exam-attempts/:attemptId/result", (req, res) =>
	adminController.recordExamResult(req, res)
);

// GET /api/admin/exams/:examId/attempts - Get all attempts for an exam
router.get("/exams/:examId/attempts", (req, res) =>
	adminController.getExamAttempts(req, res)
);

// === Vehicle Routes ===

// POST /api/admin/vehicles - Create a new vehicle
router.post("/vehicles", (req, res) => adminController.createVehicle(req, res));

// GET /api/admin/vehicles - Get all vehicles
router.get("/vehicles", (req, res) => adminController.getAllVehicles(req, res));

// PUT /api/admin/vehicles/:vehicleId/assign - Assign vehicle to trainer
router.put("/vehicles/:vehicleId/assign", (req, res) =>
	adminController.assignVehicleToTrainer(req, res)
);

// === Dashboard Routes ===

// GET /api/admin/dashboard/stats - Get dashboard statistics
router.get("/dashboard/stats", (req, res) =>
	adminController.getDashboardStats(req, res)
);

// GET /api/admin/dashboard/activities - Get recent activities
router.get("/dashboard/activities", (req, res) =>
	adminController.getRecentActivities(req, res)
);

// GET /api/admin/dashboard/revenue - Get revenue analytics
router.get("/dashboard/revenue", (req, res) =>
	adminController.getRevenueAnalytics(req, res)
);

// === Enhanced Student Routes ===

// GET /api/admin/students/:studentId - Get student details
router.get("/students/:studentId", (req, res) =>
	adminController.getStudentDetails(req, res)
);

// PUT /api/admin/students/:studentId/assign-teacher - Assign teacher to student
router.put("/students/:studentId/assign-teacher", (req, res) =>
	adminController.assignTeacherToStudent(req, res)
);

// PUT /api/admin/students/:studentId/assign-trainer - Assign trainer to student
router.put("/students/:studentId/assign-trainer", (req, res) =>
	adminController.assignTrainerToStudent(req, res)
);

// PUT /api/admin/students/:studentId - Update student
router.put("/students/:studentId", (req, res) =>
	adminController.updateStudent(req, res)
);

// DELETE /api/admin/students/:studentId - Delete student
router.delete("/students/:studentId", (req, res) =>
	adminController.deleteStudent(req, res)
);

// === Enhanced Teacher Routes ===

// GET /api/admin/teachers/:teacherId - Get teacher details
router.get("/teachers/:teacherId", (req, res) =>
	adminController.getTeacherDetails(req, res)
);

// PUT /api/admin/teachers/:teacherId - Update teacher
router.put("/teachers/:teacherId", (req, res) =>
	adminController.updateTeacher(req, res)
);

// DELETE /api/admin/teachers/:teacherId - Delete teacher
router.delete("/teachers/:teacherId", (req, res) =>
	adminController.deleteTeacher(req, res)
);

// === Enhanced Trainer Routes ===

// GET /api/admin/trainers/:trainerId - Get trainer details
router.get("/trainers/:trainerId", (req, res) =>
	adminController.getTrainerDetails(req, res)
);

// PUT /api/admin/trainers/:trainerId - Update trainer
router.put("/trainers/:trainerId", (req, res) =>
	adminController.updateTrainer(req, res)
);

// DELETE /api/admin/trainers/:trainerId - Delete trainer
router.delete("/trainers/:trainerId", (req, res) =>
	adminController.deleteTrainer(req, res)
);

// === Enhanced Vehicle Routes ===

// PUT /api/admin/vehicles/:vehicleId - Update vehicle
router.put("/vehicles/:vehicleId", (req, res) =>
	adminController.updateVehicle(req, res)
);

// DELETE /api/admin/vehicles/:vehicleId - Delete vehicle
router.delete("/vehicles/:vehicleId", (req, res) =>
	adminController.deleteVehicle(req, res)
);

// POST /api/admin/vehicles/:vehicleId/maintenance - Add maintenance record
router.post("/vehicles/:vehicleId/maintenance", (req, res) =>
	adminController.addMaintenanceRecord(req, res)
);

// === Enhanced License Routes ===

// PUT /api/admin/licenses/:licenseId - Update license
router.put("/licenses/:licenseId", (req, res) =>
	adminController.updateLicense(req, res)
);

// DELETE /api/admin/licenses/:licenseId - Delete license
router.delete("/licenses/:licenseId", (req, res) =>
	adminController.deleteLicense(req, res)
);

// === Payment Routes ===

// GET /api/admin/payments - Get all payments
router.get("/payments", (req, res) =>
	adminController.getAllPayments(req, res)
);

// POST /api/admin/payments - Create payment record
router.post("/payments", (req, res) =>
	adminController.createPayment(req, res)
);

// PUT /api/admin/payments/:paymentId - Update payment
router.put("/payments/:paymentId", (req, res) =>
	adminController.updatePayment(req, res)
);

// GET /api/admin/payments/:paymentId - Get payment details
router.get("/payments/:paymentId", (req, res) =>
	adminController.getPaymentDetails(req, res)
);

module.exports = router;
