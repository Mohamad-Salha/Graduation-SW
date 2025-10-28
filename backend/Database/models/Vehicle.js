const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleSchema = new Schema({
	name: { type: String, required: true },
	registrationNumber: { type: String, required: true, unique: true },
	licenseType: {
		type: Schema.Types.ObjectId,
		ref: "License",
		required: true,
	},
	status: {
		type: String,
		enum: ["active", "maintenance"],
		default: "active",
	},
	trainers: [{ type: Schema.Types.ObjectId, ref: "User" }], // trainers who can drive
	availability: [
		{
			date: { type: Date, required: true },
			timeSlots: [
				{
					startTime: { type: String, required: true },
					endTime: { type: String, required: true },
					isBooked: { type: Boolean, default: false },
				},
			],
		},
	],
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
