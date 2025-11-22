/**
 * Example JSON response (Vehicle)
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d6001",
 *   "plateNumber": "ABC-1234",
 *   "type": "sedan",
 *   "assignedTrainerId": "6744c2f4e13b2a9f3c5d5001", // Trainer ObjectId
 *   "isAvailable": true,
 *   "__v": 0
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const VehicleSchema = new Schema({
	model: { type: String, required: true },
	licensePlate: { type: String, required: true, unique: true },
	type: { type: String, enum: ["sedan", "suv", "truck"], default: "sedan" },
	assignedTrainerId: { type: Schema.Types.ObjectId, ref: "Trainer" },
	isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
