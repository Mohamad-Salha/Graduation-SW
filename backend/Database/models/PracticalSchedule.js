/**
 * PracticalSchedule - Trainer's weekly availability schedule
 * Trainers create recurring weekly schedules that students can book
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const TimeSlotSchema = new Schema({
	day: {
		type: String,
		enum: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		required: true,
	},
	startTime: { type: String, required: true }, // e.g., "09:00"
	endTime: { type: String, required: true }, // e.g., "10:00"
	vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
	isBooked: { type: Boolean, default: false },
	bookedBy: { type: Schema.Types.ObjectId, ref: "Student" },
	attended: { type: Boolean, default: false },
	paymentAmount: { type: Number, default: 0 },
	sessionDate: { type: Date }, // Actual date when slot is booked
});

const PracticalScheduleSchema = new Schema({
	trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
	vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
	weeklySlots: [TimeSlotSchema],
	repeatForWeeks: { type: Number, default: 1 }, // How many weeks this schedule repeats
	weekStartDate: { type: Date }, // Week start date (e.g., Dec 16, 2025)
	weekEndDate: { type: Date }, // Week end date (e.g., Dec 22, 2025)
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PracticalSchedule", PracticalScheduleSchema);
