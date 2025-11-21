const authService = require("../Services/authService");

class AuthController {
	// POST /api/auth/signup
	async signup(req, res) {
		try {
			const { name, email, password, phone } = req.body;

			// Basic validation
			if (!name || !email || !password) {
				return res.status(400).json({
					error: "Name, email, and password are required",
				});
			}

			const result = await authService.signup(
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

	// POST /api/auth/login
	async login(req, res) {
		try {
			const { email, password } = req.body;

			// Basic validation
			if (!email || !password) {
				return res.status(400).json({
					error: "Email and password are required",
				});
			}

			const result = await authService.login(email, password);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(401).json({ error: error.message });
		}
	}
}

module.exports = new AuthController();
