import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGO_URI;

export async function connectDB() {
  try {
    if (mongoURI) {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB successfully");
    } else {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
