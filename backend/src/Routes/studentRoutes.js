const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/roleMiddleware");

// Apply authentication and student role check to all routes
router.use(verifyToken);
router.use(requireRole("student"));

// GET /api/student/licenses - Get all available licenses
router.get("/licenses", (req, res) =>
	studentController.getAvailableLicenses(req, res)
);

// GET /api/student/profile - Get student profile
router.get("/profile", (req, res) => studentController.getProfile(req, res));

// POST /api/student/enroll - Enroll in a course
router.post("/enroll", (req, res) =>
	studentController.enrollInCourse(req, res)
);

// GET /api/student/teachers - Get all available teachers
router.get("/teachers", (req, res) =>
	studentController.getAvailableTeachers(req, res)
);

// POST /api/student/choose-teacher - Choose theoretical teacher
router.post("/choose-teacher", (req, res) =>
	studentController.chooseTeacher(req, res)
);

// === Exam Routes ===

// GET /api/student/my-exams - Get student's exams and attempts
router.get("/my-exams", (req, res) => studentController.getMyExams(req, res));

// POST /api/student/request-retest - Register for exam (including retests)
router.post("/request-retest", (req, res) =>
	studentController.requestRetest(req, res)
);

module.exports = router;
