const studentService = require("../Services/studentService");

class StudentController {
	// GET /api/student/licenses - Get all available licenses
	async getAvailableLicenses(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await studentService.getAvailableLicenses(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/student/profile - Get student profile
	async getProfile(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await studentService.getProfile(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/student/enroll - Enroll in a course
	async enrollInCourse(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { licenseId } = req.body;

			if (!licenseId) {
				return res
					.status(400)
					.json({ error: "License ID is required" });
			}

			const result = await studentService.enrollInCourse(
				userId,
				licenseId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/student/teachers - Get all available teachers
	async getAvailableTeachers(req, res) {
		try {
			const result = await studentService.getAvailableTeachers();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/student/choose-teacher - Choose theoretical teacher
	async chooseTeacher(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { teacherId } = req.body;

			if (!teacherId) {
				return res
					.status(400)
					.json({ error: "Teacher ID is required" });
			}

			const result = await studentService.chooseTheoricalTeacher(
				userId,
				teacherId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Exam Management ===

	// GET /api/student/my-exams - Get student's exams and attempts
	async getMyExams(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await studentService.getMyExams(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/student/request-retest - Register for exam (including retests)
	async requestRetest(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { examId } = req.body;

			if (!examId) {
				return res.status(400).json({ error: "Exam ID is required" });
			}

			const result = await studentService.requestRetest(userId, examId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new StudentController();
