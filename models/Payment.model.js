import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
	{
		traineeId: { type: String, required: true },
		datePaid: { type: String, required: true, unique: true },
		package: { type: String, required: true },
		endingDate: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
