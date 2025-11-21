/**
 * Example JSON response (License)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d1201",
 *   "name": "Standard Driving License",
 *   "description": "Covers basic vehicle operation and traffic rules.",
 *   "minPracticalSessions": 10,
 *   "price": 350,
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const LicenseSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	minPracticalSessions: { type: Number, default: 10 },
	price: { type: Number, required: true },
});

module.exports = mongoose.model("License", LicenseSchema);
