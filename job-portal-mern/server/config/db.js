import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB: ${uri ? uri.substring(0, 20) + "..." : "undefined"}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000, // 30s
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
