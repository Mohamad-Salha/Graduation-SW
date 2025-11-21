const mongoose = require("./connection"); // uses your connection.js
const User = require("./models/User");
const bcrypt = require("bcrypt");

async function createAdmin() {
	try {
		// Check if an admin already exists
		const existingAdmin = await User.findOne({ role: "admin" });
		if (existingAdmin) {
			console.log("Admin already exists!");
			return;
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash("100200300xyz", 10);

		// Create admin user
		const admin = new User({
			name: "Mohamad Salha",
			email: "mohamadsalha88@gmail.com",
			password: hashedPassword,
			role: "admin",
		});

		await admin.save();
		console.log("Admin user created successfully!");
	} catch (err) {
		console.error("Error creating admin:", err);
	} finally {
		mongoose.connection.close();
	}
}

// Run the function
createAdmin();
