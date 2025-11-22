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

	// POST /api/teacher/schedules - Create weekly theoretical schedule
	async createSchedule(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { courseId, weeklySlots, location } = req.body;

			if (!courseId || !weeklySlots || !location) {
				return res.status(400).json({
					error: "Course ID, weekly slots, and location are required",
				});
			}

			if (!Array.isArray(weeklySlots) || weeklySlots.length !== 3) {
				return res.status(400).json({
					error: "Weekly slots must be an array of exactly 3 time slots",
				});
			}

			// Validate each slot has required fields
			for (const slot of weeklySlots) {
				if (!slot.day || !slot.startTime || !slot.endTime) {
					return res.status(400).json({
						error: "Each slot must have day, startTime, and endTime",
					});
				}
			}

			const result = await teacherService.createSchedule(
				userId,
				courseId,
				weeklySlots,
				location
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
