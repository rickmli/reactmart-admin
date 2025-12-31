import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // 1 表示非正常退出
  }
};
