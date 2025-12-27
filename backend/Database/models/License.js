/**
 * Example JSON response (License)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1201",
 *   "name": "Private Car – Manual",
 *   "description": "Standard manual transmission vehicle license",
 *   "category": "private",
 *   "minPracticalSessions": 10,
 *   "pricePerSession": 25,
 *   "registrationFee": 50,
 *   "totalPrice": 300,
 *   "icon": "car",
 *   "color": "blue",
 *   "isPopular": true,
 *   "estimatedDuration": "8-12 weeks",
 *   "difficulty": "beginner",
 *   "createdAt": "2025-12-27T08:00:00.000Z",
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const LicenseSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	category: {
		type: String,
		enum: ["private", "motorcycle", "commercial", "heavy", "public-transport"],
		required: true,
	},
	minPracticalSessions: { type: Number, default: 10 },

	// Pricing breakdown
	pricePerSession: { type: Number, required: true },
	registrationFee: { type: Number, default: 50 },
	totalPrice: { type: Number, required: true },

	// UI/Display enhancements
	icon: { type: String, default: "car" }, // car, motorcycle, truck, bus
	color: { type: String, default: "blue" }, // For theming/styling
	isPopular: { type: Boolean, default: false }, // Most popular badge

	// Additional info
	estimatedDuration: { type: String }, // "8-12 weeks"
	difficulty: {
		type: String,
		enum: ["beginner", "intermediate", "advanced"],
	},

	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("License", LicenseSchema);
