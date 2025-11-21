const express = require("express");
const router = express.Router();
const teacherController = require("../Controllers/teacherController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/roleMiddleware");

// Apply authentication and teacher role check to all routes
router.use(verifyToken);
router.use(requireRole("teacher"));

// GET /api/teacher/profile - Get teacher profile
router.get("/profile", (req, res) => teacherController.getProfile(req, res));

// GET /api/teacher/students - Get assigned students
router.get("/students", (req, res) =>
	teacherController.getAssignedStudents(req, res)
);

// POST /api/teacher/schedules - Create theoretical schedule
router.post("/schedules", (req, res) =>
	teacherController.createSchedule(req, res)
);

// GET /api/teacher/schedules - Get all schedules
router.get("/schedules", (req, res) =>
	teacherController.getSchedules(req, res)
);

// PUT /api/teacher/students/:studentId/ready - Mark student ready for theoretical exam
router.put("/students/:studentId/ready", (req, res) =>
	teacherController.markStudentReady(req, res)
);

module.exports = router;
