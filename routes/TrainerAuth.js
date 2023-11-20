import express from "express";
import Trainer from "../models/Trainer.model";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { ResetPasswordEmail } from "../utils/EmailTemplate";
import nodemailer from "nodemailer";

const router = express.Router();
const createMailTransporter = () => {
	const mailTransporter = nodemailer.createTransport({
		service: "gmail",
		port: 465,
		secure: true,
		logger: true,
		debug: true,
		secureConnection: false,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	return mailTransporter;
};

const sendResetEmail = (resetLink, email) => {
	const transporter = createMailTransporter();
	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: "Reset Password",
		html: ResetPasswordEmail({
			resetLink,
		}),
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("passed");
		}
	});
};

router.post("/register", async (req, res) => {
	const newUser = new Trainer({
		name: req.body.name,

		email: req.body.email,
		password: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString(),
		phone: req.body.phone,
		schedule: req.body.schedule,
		description: req.body.description,
		aka: req.body.aka,
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Trainer Login
router.post("/login", async (req, res) => {
	try {
		const user = await Trainer.findOne({
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

router.post("/check-email", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await Trainer.findOne({ email });

		if (user) {
			const resetLink = `http://localhost:3000/passwordResetTrainer?id=${user._id}`;
			sendResetEmail(resetLink, email);

			// Email exists in the database
			return res.status(200).json({
				message: "Email found in the database.",
			});
		} else {
			// Email does not exist in the database
			return res
				.status(404)
				.json({ error: "Email not found in the database." });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
});

router.post("/update-password", async (req, res) => {
	const { id, password } = req.body;

	try {
		const user = await Trainer.findById(id);

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// Update the user's password using CryptoJS encryption
		user.password = CryptoJS.AES.encrypt(
			password,
			process.env.PASS_SEC
		).toString();

		await user.save();

		res.status(200).json({ message: "Password updated successfully." });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
});

export default router;
