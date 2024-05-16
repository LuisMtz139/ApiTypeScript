import app from './app';
import dotenv from "dotenv";
import { Signale } from "signale";

dotenv.config();

const PORT = process.env.PORT || 3000;

const signale = new Signale();

app.listen(PORT, () => {
	console.log("success");
	signale.success(`Server is running on port ${PORT}`)
});
