const express = require("express");
const router = express.Router();
const trainerController = require("../Controllers/trainerController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/roleMiddleware");

// Apply authentication and trainer role check to all routes
router.use(verifyToken);
router.use(requireRole("trainer"));

// GET /api/trainer/profile - Get trainer profile
router.get("/profile", (req, res) => trainerController.getProfile(req, res));

// GET /api/trainer/students - Get assigned students
router.get("/students", (req, res) =>
	trainerController.getAssignedStudents(req, res)
);

// POST /api/trainer/sessions - Schedule practical session
router.post("/sessions", (req, res) =>
	trainerController.schedulePracticalSession(req, res)
);

// GET /api/trainer/sessions - Get all sessions
router.get("/sessions", (req, res) => trainerController.getSessions(req, res));

// PUT /api/trainer/sessions/:sessionId/attendance - Mark session attendance
router.put("/sessions/:sessionId/attendance", (req, res) =>
	trainerController.markAttendance(req, res)
);

// PUT /api/trainer/students/:studentId/ready - Mark student ready for practical exam
router.put("/students/:studentId/ready", (req, res) =>
	trainerController.markStudentReadyForPractical(req, res)
);

module.exports = router;
