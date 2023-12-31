import express from "express";
import Trainee from "../models/Trainee.model"

const router = express.Router();

//Update a Trainee
router.put("/:id", async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString();
	}

	try {
		const updatedUser = await Trainee.findByIdAndUpdate(
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

//Delete a Trainee
router.delete("/:id", async (req, res) => {
	try {
		await Trainee.findByIdAndDelete(req.params.id);
		res.status(200).json("Trainee has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get one specific Trainee
router.get("/find/:id", async (req, res) => {
	try {
		const user = await Trainee.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get all Trainee
router.get("/", async (req, res) => {
	const query = req.query.new;
	try {
		const users = query
			? await Trainee.find().sort({ _id: -1 }).limit(5)
			: await Trainee.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
