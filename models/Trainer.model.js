import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		schedule: { type: String, required: true },
		description: { type: String, required: true },
		aka: { type: String, required: true },
		trainee: [
			{
				traineeId: {
					type: String,
				},
				name: {
					type: String,
				},
				phone: {
					type: String,
				},
				package: {
					type: String,
				},
				endingDate: { type: String, required: true },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Trainer", TrainerSchema);
