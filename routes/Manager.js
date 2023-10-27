import express from "express";
import Manager from "../models/Manager.model";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
	const newUser = new Manager({
		name: req.body.name,

		email: req.body.email,
		password: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString(),
		phone: req.body.phone,
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Manager Login
router.post("/login", async (req, res) => {
	try {
		const user = await Manager.findOne({
			email: req.body.email,
		});

		if (!user) {
			return res.status(401).json("Invalid Credentials");
		}

		if (user) {
			const hashedPassword = CryptoJS.AES.decrypt(
				user.password,
				process.env.PASS_SEC
			);

			const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

			const inputPassword = req.body.password;

			if (originalPassword !== inputPassword) {
				return res.status(401).json("Invalid Credentials");
			}

			const accessToken = jwt.sign(
				{
					id: user._id,
					isAdmin: user.isAdmin,
				},
				process.env.JWT_SEC,
				{ expiresIn: "3d" }
			);

			const { password, ...others } = user._doc;
			res.status(200).json({ ...others, accessToken });
		}
	} catch (err) {
		console.error(err);
	}
});

export default router;
