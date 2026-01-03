import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import router from './src/routes/pastebinLite.route.js'
import htmlrouter from './src/routes/html.route.js'
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use("/api", router);
app.use("/p", htmlrouter);

connectDB();

export default app;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });
