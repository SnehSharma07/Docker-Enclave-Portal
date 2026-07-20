import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import logger from "./utils/logger.js";
import ROUTE_MANIFEST from "./utils/listRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    // Allow the frontend (different origin/port) to load uploaded images.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors());

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(express.urlencoded({extended: true,}));

/*
|--------------------------------------------------------------------------
| Static Files (Uploaded Images)
|--------------------------------------------------------------------------
*/

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully.",
    // If PUT/PATCH admin routes are missing here, this process is running
    // stale code - fully stop and restart the server.
    routes: ROUTE_MANIFEST,
  });
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/contact", contactRoutes);

app.use("/api/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;