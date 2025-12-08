const mongoose = require("./connection");
const User = require("./models/User");
const Teacher = require("./models/Teacher");
const bcrypt = require("bcrypt");

const seedTeachers = async () => {
	try {
		console.log("Connected to MongoDB successfully");

		// Check if teachers already exist
		const existingTeachers = await Teacher.find();
		if (existingTeachers.length > 0) {
			console.log("⚠️  Teachers already exist. Skipping seed.");
			process.exit(0);
		}

		const hashedPassword = await bcrypt.hash("teacher123", 10);

		// Create teacher users
		const teacherUsers = [
			{
				name: "Suliman",
				email: "suliman@driving.com",
				phone: "0501234567",
				password: hashedPassword,
				role: "teacher",
			},
			{
				name: "Majed",
				email: "majed@driving.com",
				phone: "0507654321",
				password: hashedPassword,
				role: "teacher",
			},
			{
				name: "Ahmed",
				email: "ahmed@driving.com",
				phone: "0509876543",
				password: hashedPassword,
				role: "teacher",
			},
		];

		// Insert users and create teacher profiles
		for (const teacherData of teacherUsers) {
			// Create user
			const user = await User.create(teacherData);

			// Create teacher profile
			await Teacher.create({
				userId: user._id,
				assignedStudents: [],
			});

			console.log(`✅ Created teacher: ${teacherData.name}`);
		}

		console.log("✅ Teachers seeded successfully!");
		console.log("📧 All teachers have password: teacher123");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding teachers:", error);
		process.exit(1);
	}
};

seedTeachers();
