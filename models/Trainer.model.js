import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		schedule: { type: String, required: true },
		trainee: [
			{
				traineeId: {
					type: String,
				},
				name: {
					type: String,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Trainer", TrainerSchema);
