import * as dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const mongodb_url = process.env.MONGODB_URL as string;

export default async function connectDB() {
  try {
    await mongoose.connect(mongodb_url, {
      autoCreate: true,
      serverSelectionTimeoutMS: 2500,
    });
    // get connection stats
    const stats = await mongoose.connection.db.stats();
    console.log(`Connected to MongoDB @ ${stats.db} database`);
  } catch (error) {
    console.error(error);
  }
}