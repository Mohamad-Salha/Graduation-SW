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

module.exports = router;
