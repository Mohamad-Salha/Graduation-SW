const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");

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

module.exports = router;
