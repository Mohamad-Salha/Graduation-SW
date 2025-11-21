const bcrypt = require("bcrypt");
const authRepo = require("../Repositories/authRepos");

class AuthService {
	// Student signup
	async signup(name, email, password, phone) {
		// Check if user already exists
		const existingUser = await authRepo.findUserByEmail(email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user with student role
		const user = await authRepo.createUser({
			name,
			email,
			password: hashedPassword,
			phone,
			role: "student",
		});

		// Create student profile (status: pending)
		const student = await authRepo.createStudent(user._id);

		return {
			message: "Signup successful. Waiting for admin approval.",
			userId: user._id,
			studentId: student._id,
			status: student.status,
		};
	}

	// Login for all roles
	async login(email, password) {
		// Find user by email
		const user = await authRepo.findUserByEmail(email);
		if (!user) {
			throw new Error("Invalid email or password");
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
		}

		// If student, check approval status
		if (user.role === "student") {
			const student = await authRepo.findStudentByUserId(user._id);
			if (student.status === "pending") {
				throw new Error("Your account is pending admin approval");
			}
		}

		return {
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}
}

module.exports = new AuthService();
