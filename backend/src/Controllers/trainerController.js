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
}

module.exports = new TrainerController();
