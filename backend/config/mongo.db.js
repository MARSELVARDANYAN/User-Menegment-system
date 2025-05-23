import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${db.connection.host}`);
    return db;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};



export default connectDB;
