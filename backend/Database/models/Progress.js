const mongoose = require("mongoose");
const { Schema } = mongoose;

const progressSchema = new Schema(
	{
		student: { type: Schema.Types.ObjectId, ref: "User", required: true },
		course: { type: Schema.Types.ObjectId, ref: "Course" }, // For theoretical courses
		session: { type: Schema.Types.ObjectId, ref: "Session" }, // For practical sessions
		improvementPercentage: { type: Number, min: 0, max: 100 },
		notes: String,
		evaluationDate: { type: Date, default: Date.now },
	},
	{
		validate: [
			{
				validator: function () {
					return (
						(this.course && !this.session) ||
						(!this.course && this.session)
					);
				},
				message:
					"Either course or session must be provided, but not both",
			},
		],
	}
);

module.exports = mongoose.model("Progress", progressSchema);
