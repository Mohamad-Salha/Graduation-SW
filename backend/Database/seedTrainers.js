const mongoose = require("./connection");
const User = require("./models/User");
const Trainer = require("./models/Trainer");
const bcrypt = require("bcrypt");

const seedTrainers = async () => {
	try {
		console.log("Connected to MongoDB successfully");

		// Check if trainers already exist
		const existingTrainers = await Trainer.find();
		if (existingTrainers.length > 0) {
			console.log("⚠️  Trainers already exist. Skipping seed.");
			process.exit(0);
		}

		const hashedPassword = await bcrypt.hash("trainer123", 10);

		// Create trainer users with different vehicle specialties
		const trainerUsers = [
			{
				name: "عبد الرحمن",
				email: "abdulrahman@driving.com",
				phone: "0502345678",
				password: hashedPassword,
				role: "trainer",
			},
			{
				name: "خالد",
				email: "khaled@driving.com",
				phone: "0503456789",
				password: hashedPassword,
				role: "trainer",
			},
			{
				name: "محمود",
				email: "mahmoud@driving.com",
				phone: "0504567890",
				password: hashedPassword,
				role: "trainer",
			},
			{
				name: "فهد",
				email: "fahad@driving.com",
				phone: "0505678901",
				password: hashedPassword,
				role: "trainer",
			},
		];

		// Insert users and create trainer profiles
		for (const trainerData of trainerUsers) {
			// Create user
			const user = await User.create(trainerData);

			// Create trainer profile
			await Trainer.create({
				userId: user._id,
				assignedStudents: [],
			});

			console.log(`✅ Created trainer: ${trainerData.name}`);
		}

		console.log("✅ Trainers seeded successfully!");
		console.log("📧 All trainers have password: trainer123");
		console.log("\nTrainer accounts:");
		console.log("- عبد الرحمن: abdulrahman@driving.com / trainer123");
		console.log("- خالد: khaled@driving.com / trainer123");
		console.log("- محمود: mahmoud@driving.com / trainer123");
		console.log("- فهد: fahad@driving.com / trainer123");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding trainers:", error);
		process.exit(1);
	}
};

seedTrainers();
