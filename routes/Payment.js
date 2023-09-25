import express from "express";
import Payment from "../models/Payment.model";

const router = express.Router();

router.post("/", async (req, res) => {
	const newPayment = new Payment(req.body);

	try {
		const savedPayment = await newPayment.save();
		res.status(200).json(savedPayment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Update a Payment
router.put("/:id", async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString();
	}

	try {
		const updatedUser = await Payment.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Delete a Payment
router.delete("/:id", async (req, res) => {
	try {
		await Payment.findByIdAndDelete(req.params.id);
		res.status(200).json("Payment has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get one specific Payment
router.get("/find/:id", async (req, res) => {
	try {
		const user = await Payment.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get all Payment
router.get("/", async (req, res) => {
	const query = req.query.new;
	try {
		const users = query
			? await Payment.find().sort({ _id: -1 }).limit(5)
			: await Payment.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
