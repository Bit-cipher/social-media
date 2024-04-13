import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI);
export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
  }
};
