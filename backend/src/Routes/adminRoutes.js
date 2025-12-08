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

module.exports = router;
