import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectedDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
connectedDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use(express.static(path.join(__dirname, "./frontend/build")));

//REST API
app.use("*", function (req, res) {
  res.sendFile(path.json(__dirname, "./frontend/build/index.html"));
});

//PORT
const PORT = process.env.PORT || 8080;

//RUN LISTEN
app.listen(PORT, () => {
  console.log(
    `server Running on mode ${process.env.DEV_MODE} ON PORT ${PORT}`.bgYellow
      .black
  );
});
