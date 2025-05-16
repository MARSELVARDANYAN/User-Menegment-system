import connectDB from "./config/mongo.db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

async function start() {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();
