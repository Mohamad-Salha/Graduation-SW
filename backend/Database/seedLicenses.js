const mongoose = require("./connection");
const License = require("./models/License");

const licenses = [
	{
		name: "Manual Transmission Car",
		description: "Learn to drive manual transmission vehicles",
		price: 1500,
		minPracticalSessions: 20,
	},
	{
		name: "Automatic Transmission Car",
		description: "Learn to drive automatic transmission vehicles",
		price: 1500,
		minPracticalSessions: 20,
	},
	{
		name: "Motorcycle",
		description: "Learn to ride motorcycles",
		price: 1200,
		minPracticalSessions: 15,
	},
	{
		name: "Light Truck",
		description: "Learn to drive light trucks",
		price: 1800,
		minPracticalSessions: 25,
	},
	{
		name: "Heavy Truck",
		description: "Learn to drive heavy trucks",
		price: 2500,
		minPracticalSessions: 30,
	},
	{
		name: "Trailer",
		description: "Learn to drive trailers",
		price: 2200,
		minPracticalSessions: 28,
	},
	{
		name: "Bus",
		description: "Learn to drive buses",
		price: 2800,
		minPracticalSessions: 35,
	},
];

async function seedLicenses() {
	try {
		// Check if licenses already exist
		const existingLicenses = await License.find();
		if (existingLicenses.length > 0) {
			console.log("Licenses already exist!");
			return;
		}

		// Create licenses
		await License.insertMany(licenses);
		console.log("✅ Licenses seeded successfully!");
	} catch (err) {
		console.error("Error seeding licenses:", err);
	} finally {
		mongoose.connection.close();
	}
}

// Run the function
seedLicenses();
