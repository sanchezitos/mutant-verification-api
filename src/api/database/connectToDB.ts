import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error: any) {
    console.error("Error disconnecting from MongoDB:", error.message);
    process.exit(1);
  }
};
