import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import config from "./config/dotenv.config.js";
import path from "path"
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Static files
app.use(express.static(path.join(__dirname, "./public")));


// middlewares
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(express.static("public"));
app.use(cookieParser());


import issuesRoutes from "./routes/issue.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import authRoutes from "./routes/auth.routes.js";


// routes declaration
app.use("/api/admin", authRoutes)
app.use("/api/issues", issuesRoutes)
app.use("/api/inventory", inventoryRoutes)


// health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running 🚀",
  });
});


// universal panel
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
})

// global error handler
app.use(errorMiddleware)

export default app