import express from "express";
import Trainer from "../models/Trainer.model"

const router = express.Router();

//Update a Trainer
router.put("/:id", async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString();
	}

	try {
		const updatedUser = await Trainer.findByIdAndUpdate(
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

//Delete a Trainer
router.delete("/:id", async (req, res) => {
	try {
		await Trainer.findByIdAndDelete(req.params.id);
		res.status(200).json("Trainer has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get one specific Trainer
router.get("/find/:id", async (req, res) => {
	try {
		const user = await Trainer.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get all Trainer
router.get("/", async (req, res) => {
	const query = req.query.new;
	try {
		const users = query
			? await Trainer.find().sort({ _id: -1 }).limit(5)
			: await Trainer.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Define a route to delete a trainee from the Trainer model
router.delete('/:trainerId/trainees/:traineeId', async (req, res) => {
  const trainerId = req.params.trainerId;
  const traineeId = req.params.traineeId;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Find the index of the trainee with the given traineeId
    const traineeIndex = trainer.trainee.findIndex(
      (trainee) => trainee.traineeId === traineeId
    );

    if (traineeIndex === -1) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    // Remove the trainee from the array
    trainer.trainee.splice(traineeIndex, 1);

    // Save the updated trainer
    await trainer.save();

    res.json({ message: 'Trainee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
