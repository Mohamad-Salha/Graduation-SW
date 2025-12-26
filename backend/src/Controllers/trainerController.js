const trainerService = require("../Services/trainerService");

class TrainerController {
	// GET /api/trainer/profile
	async getProfile(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await trainerService.getProfile(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
	// PUT /api/trainer/profile - Update trainer profile
	async updateProfile(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const updates = req.body;
			const result = await trainerService.updateProfile(userId, updates);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
	// GET /api/trainer/students
	async getAssignedStudents(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await trainerService.getAssignedStudents(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// POST /api/trainer/sessions
	async schedulePracticalSession(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { studentId, date, time, vehicleId, paymentAmount } =
				req.body;

			if (!studentId || !date || !time) {
				return res.status(400).json({
					error: "Student ID, date, and time are required",
				});
			}

			const result = await trainerService.schedulePracticalSession(
				userId,
				{ studentId, date, time, vehicleId, paymentAmount }
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/trainer/sessions
	async getSessions(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await trainerService.getSessions(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/trainer/sessions/:sessionId/attendance
	async markAttendance(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { sessionId } = req.params;
			const { attended } = req.body;

			if (typeof attended !== "boolean") {
				return res.status(400).json({
					error: "Attended field is required and must be boolean",
				});
			}

			const result = await trainerService.markAttendance(
				userId,
				sessionId,
				attended
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/trainer/students/:studentId/ready
	async markStudentReadyForPractical(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { studentId } = req.params;

			const result = await trainerService.markStudentReadyForPractical(
				userId,
				studentId
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === New Scheduling System ===

	// POST /api/trainer/schedules
	async createSchedule(req, res) {
		try {
			const userId = req.user.id;
			const { weeklySlots, repeatForWeeks, vehicleId } = req.body;

			if (
				!weeklySlots ||
				!Array.isArray(weeklySlots) ||
				weeklySlots.length === 0
			) {
				return res.status(400).json({
					error: "weeklySlots array is required and must not be empty",
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

			const result = await trainerService.createPracticalSchedule(
				userId,
				{
					weeklySlots,
					repeatForWeeks: repeatForWeeks || 1,
					vehicleId,
				}
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/trainer/schedules
	async getSchedules(req, res) {
		try {
			const userId = req.user.id;
			const result = await trainerService.getSchedules(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/trainer/schedules/:scheduleId/slots/:slotId/attendance
	async markSlotAttendance(req, res) {
		try {
			const userId = req.user.id;
			const { scheduleId, slotId } = req.params;
			const { attended, paymentAmount } = req.body;

			if (typeof attended !== "boolean") {
				return res.status(400).json({
					error: "attended field is required and must be boolean",
				});
			}

			const result = await trainerService.markSlotAttendance(
				userId,
				scheduleId,
				slotId,
				attended,
				paymentAmount || 0
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new TrainerController();
