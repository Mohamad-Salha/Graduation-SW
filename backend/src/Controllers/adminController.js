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

	// === License Management ===

	// POST /api/admin/licenses
	async createLicense(req, res) {
		try {
			const { name, description, minPracticalSessions, price } = req.body;

			if (!name || !price) {
				return res
					.status(400)
					.json({ error: "Name and price are required" });
			}

			const result = await adminService.createLicense(
				name,
				description,
				minPracticalSessions,
				price
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/licenses
	async getAllLicenses(req, res) {
		try {
			const result = await adminService.getAllLicenses();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Teacher Management ===

	// POST /api/admin/teachers
	async createTeacher(req, res) {
		try {
			const { name, email, password, phone } = req.body;

			if (!name || !email || !password) {
				return res
					.status(400)
					.json({ error: "Name, email, and password are required" });
			}

			const result = await adminService.createTeacher(
				name,
				email,
				password,
				phone
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/teachers
	async getAllTeachers(req, res) {
		try {
			const result = await adminService.getAllTeachers();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// === Trainer Management ===

	// POST /api/admin/trainers
	async createTrainer(req, res) {
		try {
			const { name, email, password, phone } = req.body;

			if (!name || !email || !password) {
				return res
					.status(400)
					.json({ error: "Name, email, and password are required" });
			}

			const result = await adminService.createTrainer(
				name,
				email,
				password,
				phone
			);
			return res.status(201).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/admin/trainers
	async getAllTrainers(req, res) {
		try {
			const result = await adminService.getAllTrainers();
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new AdminController();
