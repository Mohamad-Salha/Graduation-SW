const mongoose = require("./connection");
const Vehicle = require("./models/Vehicle");

const seedVehicles = async () => {
	try {
		console.log("Connected to MongoDB successfully");

		// Check if vehicles already exist
		const existingVehicles = await Vehicle.find();
		if (existingVehicles.length > 0) {
			console.log("⚠️  Vehicles already exist. Skipping seed.");
			process.exit(0);
		}

		// Create 3 available vehicles
		const vehicles = [
			{
				model: "Toyota Corolla 2023",
				licensePlate: "ABC-1234",
				type: "sedan",
				isAvailable: true,
			},
			{
				model: "Honda CR-V 2024",
				licensePlate: "XYZ-5678",
				type: "suv",
				isAvailable: true,
			},
			{
				model: "Ford F-150 2023",
				licensePlate: "DEF-9012",
				type: "truck",
				isAvailable: true,
			},
		];

		// Insert vehicles
		const createdVehicles = await Vehicle.insertMany(vehicles);

		console.log("✅ Vehicles seeded successfully:");
		createdVehicles.forEach((vehicle) => {
			console.log(
				`   - ${vehicle.licensePlate} | ${vehicle.model} | ${vehicle.type} | Available: ${vehicle.isAvailable}`
			);
		});

		console.log(`\n📊 Total vehicles created: ${createdVehicles.length}`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding vehicles:", error);
		process.exit(1);
	}
};

seedVehicles();
