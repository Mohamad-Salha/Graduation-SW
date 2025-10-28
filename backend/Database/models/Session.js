const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = new Schema(
	{
		student: { type: Schema.Types.ObjectId, ref: "User", required: true },
		trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
		vehicle: {
			type: Schema.Types.ObjectId,
			ref: "Vehicle",
			required: true,
		},
		date: { type: Date, required: true },
		startTime: {
			type: String,
			required: true,
			match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
		},
		endTime: {
			type: String,
			required: true,
			match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
		},
		status: {
			type: String,
			enum: ["scheduled", "completed", "cancelled", "no-show"],
			default: "scheduled",
		},
	},
	{
		validate: [
			{
				validator: async function (v) {
					const Vehicle = mongoose.model("Vehicle");
					const vehicle = await Vehicle.findById(this.vehicle);
					return vehicle && vehicle.trainers.includes(this.trainer);
				},
				message: "Trainer must be authorized to use this vehicle",
			},
		],
	}
);

module.exports = mongoose.model("Session", sessionSchema);
