import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import dbConnection from "./utils/connectDB.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

dbConnection();

const port = process.env.PORT || 8800;

const app = express();

// ✅ DESKTOP FOLDER PATH - Static serve karne ke liye
const DESKTOP_FOLDER = 'C:\\Users\\mrakh\\OneDrive\\Desktop\\Database';

// ✅ Serve static files from desktop folder
app.use('/uploads', express.static(DESKTOP_FOLDER));

// CORS - Allow all localhost ports
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.match(/^http:\/\/localhost:\d+$/)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Upload route
app.use("/api/upload", uploadRoutes);
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));