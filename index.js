//Dependencies
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import Mongoose from "mongoose";
import cors from "cors";

//Routes

const app = express();
const PORT = process.env.PORT || 7001;

Mongoose.connect(process.env.MONGO_URL)
	.then(() => console.log("Database started "))
	.catch((err) => {
		console.log(err);
	});
const corsOptions = {
	origin: "*",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());


app.listen(PORT, () => {
	console.log(" backend started ");
});
