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

// PUT /api/teacher/profile - Update teacher profile
router.put("/profile", (req, res) => teacherController.updateProfile(req, res));

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

// GET /api/teacher/students/:studentId - Get student details with attendance
router.get("/students/:studentId", (req, res) =>
	teacherController.getStudentDetails(req, res)
);

// ============ LECTURE MANAGEMENT ROUTES ============

// POST /api/teacher/lectures - Create a new lecture
router.post("/lectures", (req, res) =>
	teacherController.createLecture(req, res)
);

// GET /api/teacher/lectures - Get all lectures (with optional filters)
router.get("/lectures", (req, res) => teacherController.getLectures(req, res));

// GET /api/teacher/lectures/today - Get today's lectures
router.get("/lectures/today", (req, res) =>
	teacherController.getTodayLectures(req, res)
);

// GET /api/teacher/lectures/upcoming - Get upcoming lectures
router.get("/lectures/upcoming", (req, res) =>
	teacherController.getUpcomingLectures(req, res)
);

// GET /api/teacher/lectures/:lectureId - Get lecture details
router.get("/lectures/:lectureId", (req, res) =>
	teacherController.getLectureDetails(req, res)
);

// PUT /api/teacher/lectures/:lectureId/attendance - Mark attendance for lecture
router.put("/lectures/:lectureId/attendance", (req, res) =>
	teacherController.markAttendance(req, res)
);

// PUT /api/teacher/lectures/:lectureId - Update lecture details
router.put("/lectures/:lectureId", (req, res) =>
	teacherController.updateLecture(req, res)
);

// PUT /api/teacher/lectures/:lectureId/cancel - Cancel a lecture
router.put("/lectures/:lectureId/cancel", (req, res) =>
	teacherController.cancelLecture(req, res)
);

module.exports = router;
