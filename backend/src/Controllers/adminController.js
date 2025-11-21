const adminService = require("../Services/adminService");

class AdminController {
	// GET /api/admin/students/pending
	async getPendingStudents(req, res) {
		try {
			const result = await adminService.getPendingStudents();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/students
	async getAllStudents(req, res) {
		try {
			const result = await adminService.getAllStudents();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/approve
	async approveStudent(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.approveStudent(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// PUT /api/admin/students/:studentId/reject
	async rejectStudent(req, res) {
		try {
			const { studentId } = req.params;
			const result = await adminService.rejectStudent(studentId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new AdminController();
