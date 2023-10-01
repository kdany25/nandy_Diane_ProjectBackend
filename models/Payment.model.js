import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
	{
		traineeId: { type: String, required: true },
		datePaid: { type: String, required: true },
		package: { type: String, required: true },
		endingDate: { type: String, required: true },
		name: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
