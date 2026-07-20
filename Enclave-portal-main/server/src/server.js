import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import ROUTE_MANIFEST from "./utils/listRoutes.js";

const PORT = process.env.PORT || 8888;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);

      // Print the active route table so a stale/old server process is
      // immediately obvious - compare this list against what you expect.
      logger.info("Active routes:");
      ROUTE_MANIFEST.forEach((route) => logger.info(`  ${route}`));
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();