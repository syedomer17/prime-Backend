import config from "config";
import mongoose from "mongoose";

const dbUrl: string = config.get<string>("DB_URL");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true); // Ensures better query handling
    await mongoose.connect(dbUrl);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit process on failure
  }
};

export default dbConnect; // Export for potential reuse
