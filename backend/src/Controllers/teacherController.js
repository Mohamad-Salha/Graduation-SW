const teacherService = require("../Services/teacherService");

class TeacherController {
	// GET /api/teacher/profile - Get teacher profile
	async getProfile(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await teacherService.getProfile(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/students - Get assigned students
	async getAssignedStudents(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await teacherService.getAssignedStudents(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/teacher/schedules - Create theoretical schedule
	async createSchedule(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const {
				lectureTitle,
				date,
				startTime,
				endTime,
				location,
				description,
			} = req.body;

			if (!lectureTitle || !date || !startTime || !endTime || !location) {
				return res.status(400).json({
					error: "Lecture title, date, start time, end time, and location are required",
				});
			}

			const result = await teacherService.createSchedule(
				userId,
				lectureTitle,
				date,
				startTime,
				endTime,
				location,
				description
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/schedules - Get all schedules
	async getSchedules(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await teacherService.getSchedules(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/teacher/students/:studentId/ready - Mark student ready for theo exam
	async markStudentReady(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { studentId } = req.params;

			const result = await teacherService.markStudentReadyForExam(
				userId,
				studentId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new TeacherController();
