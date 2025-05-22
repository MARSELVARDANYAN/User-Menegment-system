import connectDB from "./config/mongo.db.js";
import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose"; // важно, если используешь mongoose

dotenv.config();

async function start() {
  try {
    await connectDB(); 
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      await mongoose.connection.close(); 
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();