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

// PUT /api/trainer/profile - Update trainer profile
router.put("/profile", (req, res) => trainerController.updateProfile(req, res));

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

// === New Scheduling System ===

// POST /api/trainer/schedules - Create weekly availability schedule
router.post("/schedules", (req, res) =>
	trainerController.createSchedule(req, res)
);

// POST /api/trainer/schedule/create-weekly - Create weekly schedule with time slots
router.post("/schedule/create-weekly", (req, res) =>
	trainerController.createWeeklySchedule(req, res)
);

// GET /api/trainer/schedules - Get trainer's schedules
router.get("/schedules", (req, res) =>
	trainerController.getSchedules(req, res)
);

// GET /api/trainer/schedule - Get trainer's schedule (unified)
router.get("/schedule", (req, res) => trainerController.getSchedule(req, res));

// GET /api/trainer/vehicles - Get assigned vehicles
router.get("/vehicles", (req, res) => trainerController.getVehicles(req, res));

// PUT /api/trainer/schedules/:scheduleId/slots/:slotId/attendance - Mark slot attendance
router.put("/schedules/:scheduleId/slots/:slotId/attendance", (req, res) =>
	trainerController.markSlotAttendance(req, res)
);

module.exports = router;
