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

// === Practical Session Routes ===

// GET /api/student/trainers - Get all available trainers
router.get("/trainers", (req, res) =>
	studentController.getAvailableTrainers(req, res)
);

// POST /api/student/choose-trainer - Choose trainer
router.post("/choose-trainer", (req, res) =>
	studentController.chooseTrainer(req, res)
);

// GET /api/student/my-sessions - Get student's practical sessions
router.get("/my-sessions", (req, res) =>
	studentController.getMyPracticalSessions(req, res)
);

// === New Booking System ===

// GET /api/student/available-slots - View available slots (optionally filter by trainer)
router.get("/available-slots", (req, res) =>
	studentController.getAvailableSlots(req, res)
);

// POST /api/student/book-slot - Book a practical slot
router.post("/book-slot", (req, res) => studentController.bookSlot(req, res));

// GET /api/student/my-bookings - Get student's booked sessions
router.get("/my-bookings", (req, res) =>
	studentController.getMyBookings(req, res)
);

module.exports = router;
