//Dependencies
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import Mongoose from "mongoose";
import cors from "cors";

//Routes
import Payment from "./routes/Payment";
import TraineeAuth from "./routes/TraineeAuth";
import Trainee from "./routes/Trainee";
import TrainerAuth from "./routes/TrainerAuth";
import Trainer from "./routes/Trainer";

const app = express();
const PORT = process.env.PORT || 7001;

Mongoose.connect(process.env.MONGO_URL)
	.then(() => console.log("Database started "))
	.catch((err) => {
		console.log(err);
	});
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/Payment", cors(), Payment);
app.use("/api/TraineeAuth", cors(), TraineeAuth);
app.use("/api/Trainee", cors(), Trainee);
app.use("/api/TrainerAuth", cors(), TrainerAuth);
app.use("/api/Trainer", cors(), Trainer);


app.listen(PORT, () => {
	console.log("Backend Started");
});
