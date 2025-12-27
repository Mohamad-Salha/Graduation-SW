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

const MaintenanceRecordSchema = new Schema({
	date: { type: Date, required: true },
	type: { 
		type: String, 
		enum: ["routine", "repair", "inspection", "other"], 
		required: true 
	},
	description: { type: String, required: true },
	cost: { type: Number, default: 0 },
	performedBy: { type: String },
	nextMaintenanceDate: { type: Date },
	notes: { type: String }
}, { _id: true });

const VehicleSchema = new Schema({
	model: { type: String, required: true },
	licensePlate: { type: String, required: true, unique: true },
	type: { type: String, enum: ["sedan", "suv", "truck"], default: "sedan" },
	assignedTrainerId: { type: Schema.Types.ObjectId, ref: "Trainer" },
	isAvailable: { type: Boolean, default: true },
	year: { type: Number },
	color: { type: String },
	status: { 
		type: String, 
		enum: ["active", "maintenance", "inactive"], 
		default: "active" 
	},
	maintenanceRecords: [MaintenanceRecordSchema],
	lastMaintenanceDate: { type: Date },
	nextMaintenanceDate: { type: Date },
	mileage: { type: Number, default: 0 },
	fuelType: { 
		type: String, 
		enum: ["gasoline", "diesel", "electric", "hybrid"], 
		default: "gasoline" 
	},
	insuranceExpiry: { type: Date },
	registrationExpiry: { type: Date },
	notes: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
