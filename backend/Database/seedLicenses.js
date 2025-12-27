const mongoose = require("./connection");
const License = require("./models/License");

const licenses = [
	{
		name: "Private Car – Manual",
		description: "Standard manual transmission vehicle license for private use",
		category: "private",
		minPracticalSessions: 10,
		pricePerSession: 25,
		registrationFee: 50,
		totalPrice: 300,
		icon: "car",
		color: "blue",
		isPopular: true,
		estimatedDuration: "8-12 weeks",
		difficulty: "beginner",
	},
	{
		name: "Private Car – Automatic",
		description: "Automatic transmission vehicle license for easier driving",
		category: "private",
		minPracticalSessions: 8,
		pricePerSession: 25,
		registrationFee: 50,
		totalPrice: 250,
		icon: "car",
		color: "green",
		isPopular: false,
		estimatedDuration: "6-10 weeks",
		difficulty: "beginner",
	},
	{
		name: "Motorcycle",
		description: "Two-wheel motorcycle driving license",
		category: "motorcycle",
		minPracticalSessions: 6,
		pricePerSession: 25,
		registrationFee: 50,
		totalPrice: 200,
		icon: "motorcycle",
		color: "orange",
		isPopular: false,
		estimatedDuration: "4-6 weeks",
		difficulty: "intermediate",
	},
	{
		name: "Light Truck",
		description: "Light commercial vehicle license for small trucks and vans",
		category: "commercial",
		minPracticalSessions: 12,
		pricePerSession: 30,
		registrationFee: 100,
		totalPrice: 460,
		icon: "truck",
		color: "yellow",
		isPopular: false,
		estimatedDuration: "10-14 weeks",
		difficulty: "intermediate",
	},
	{
		name: "Heavy Truck",
		description: "Heavy commercial truck driving license",
		category: "heavy",
		minPracticalSessions: 16,
		pricePerSession: 45,
		registrationFee: 150,
		totalPrice: 870,
		icon: "truck",
		color: "red",
		isPopular: false,
		estimatedDuration: "12-16 weeks",
		difficulty: "advanced",
	},
	{
		name: "Trailer / Semi-Truck",
		description: "Articulated truck and trailer driving license",
		category: "heavy",
		minPracticalSessions: 18,
		pricePerSession: 45,
		registrationFee: 150,
		totalPrice: 960,
		icon: "truck",
		color: "purple",
		isPopular: false,
		estimatedDuration: "14-18 weeks",
		difficulty: "advanced",
	},
	{
		name: "Bus",
		description: "Public transport bus driving license",
		category: "public-transport",
		minPracticalSessions: 15,
		pricePerSession: 45,
		registrationFee: 150,
		totalPrice: 825,
		icon: "bus",
		color: "indigo",
		isPopular: false,
		estimatedDuration: "12-15 weeks",
		difficulty: "advanced",
	},
];

async function seedLicenses() {
	try {
		// Delete all existing licenses
		const deleteResult = await License.deleteMany({});
		console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing licenses`);

		// Create new licenses
		const result = await License.insertMany(licenses);
		console.log(`✅ Successfully seeded ${result.length} licenses!`);
		console.log("\nLicenses created:");
		result.forEach((license) => {
			console.log(
				`  - ${license.name} (${license.category}) - $${license.totalPrice} [${license.isPopular ? "POPULAR" : ""}]`
			);
		});
	} catch (err) {
		console.error("❌ Error seeding licenses:", err);
	} finally {
		mongoose.connection.close();
	}
}

// Run the function
seedLicenses();
