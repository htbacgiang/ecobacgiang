import mongoose, { mongo } from "mongoose";
const connection = {};

async function connectDb() {
  try {
    if (connection.isConnected) {
      console.log("Already connected to the database.");
      return;
    }
    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) {
        console.log("Use previous connection to the database.");
        return;
      }
      await mongoose.disconnect();
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("New connection to the database.");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnecting from the database.");
    }
  }
}
const db = { connectDb, disconnectDb };
export default db;