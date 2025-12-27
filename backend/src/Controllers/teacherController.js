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

	// PUT /api/teacher/profile - Update teacher profile
	async updateProfile(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const updates = req.body;
			const result = await teacherService.updateProfile(userId, updates);
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

	// ============ LECTURE MANAGEMENT ============

	// POST /api/teacher/lectures - Create a new lecture
	async createLecture(req, res) {
		try {
			const userId = req.user.id;
			const lectureData = req.body;

			if (!lectureData.scheduleId || !lectureData.date) {
				return res.status(400).json({
					error: "Schedule ID and date are required",
				});
			}

			const result = await teacherService.createLecture(userId, lectureData);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/lectures - Get all lectures
	async getLectures(req, res) {
		try {
			const userId = req.user.id;
			const filters = {
				startDate: req.query.startDate,
				endDate: req.query.endDate,
				courseId: req.query.courseId,
				status: req.query.status,
			};

			const result = await teacherService.getLectures(userId, filters);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/lectures/today - Get today's lectures
	async getTodayLectures(req, res) {
		try {
			const userId = req.user.id;
			const result = await teacherService.getTodayLectures(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/lectures/upcoming - Get upcoming lectures
	async getUpcomingLectures(req, res) {
		try {
			const userId = req.user.id;
			const result = await teacherService.getUpcomingLectures(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/lectures/:lectureId - Get lecture details
	async getLectureDetails(req, res) {
		try {
			const userId = req.user.id;
			const { lectureId } = req.params;

			const result = await teacherService.getLectureDetails(userId, lectureId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/teacher/lectures/:lectureId/attendance - Mark attendance
	async markAttendance(req, res) {
		try {
			const userId = req.user.id;
			const { lectureId } = req.params;
			const { attendanceData } = req.body;

			if (!attendanceData || !Array.isArray(attendanceData)) {
				return res.status(400).json({
					error: "Attendance data must be an array",
				});
			}

			const result = await teacherService.markAttendance(
				userId,
				lectureId,
				attendanceData
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/teacher/lectures/:lectureId - Update lecture details
	async updateLecture(req, res) {
		try {
			const userId = req.user.id;
			const { lectureId } = req.params;
			const updates = req.body;

			const result = await teacherService.updateLecture(
				userId,
				lectureId,
				updates
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/teacher/lectures/:lectureId/cancel - Cancel a lecture
	async cancelLecture(req, res) {
		try {
			const userId = req.user.id;
			const { lectureId } = req.params;
			const { reason } = req.body;

			if (!reason) {
				return res.status(400).json({
					error: "Cancellation reason is required",
				});
			}

			const result = await teacherService.cancelLecture(
				userId,
				lectureId,
				reason
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/teacher/students/:studentId - Get student details with attendance
	async getStudentDetails(req, res) {
		try {
			const userId = req.user.id;
			const { studentId } = req.params;

			const result = await teacherService.getStudentDetails(userId, studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new TeacherController();
