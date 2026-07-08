import mongoose from "mongoose";
import config from "./dotenv.config.js";


const connectDB = async () => {
  try {

    const connectionInstance = await mongoose.connect(
      config.MONGO_URI
    );
    console.log(
      `✅ MongoDB Connected: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(
      "❌ MongoDB Connection Failed:",
      error.message
    );
    process.exit(1);
  }
};



export default connectDB;