const mongoose = require("./connection"); // uses your connection.js
const User = require("./models/User");
const bcrypt = require("bcrypt");

async function createAdmin() {
	try {
		// Wait for database connection
		await mongoose.connection.asPromise();
		console.log("Connected to database");

		// Check if an admin already exists
		const existingAdmin = await User.findOne({ role: "admin" });
		if (existingAdmin) {
			console.log("Admin already exists!");
			console.log("Email:", existingAdmin.email);
			console.log("Name:", existingAdmin.name);
			mongoose.connection.close();
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
		console.log("Email: mohamadsalha88@gmail.com");
		console.log("Password: 100200300xyz");
	} catch (err) {
		console.error("Error creating admin:", err);
	} finally {
		mongoose.connection.close();
	}
}

// Run the function
createAdmin();
