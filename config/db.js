import mongoose from "mongoose";
import colors from "colors";

const connectedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected To Database ${conn.connection.host}`.bgGreen.black);
  } catch (error) {
    console.log(`Error in mongoose ${error}`.bgRed.black);
  }
};

export default connectedDB;
