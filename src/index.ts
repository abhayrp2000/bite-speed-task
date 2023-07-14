//ENV
import { Logger } from "./middleware/log/logger";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { prismaWrapper } from "./utils/prisma";
import express from "express";
import v1Routes from "./routes/index";
import { logRequest } from "./middleware/log/http-requests-logger";

export const logger = new Logger();

const start = async () => {
  ["POSTGRES_URL"].map((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable ${envVar}`);
    }
  });

  //* Connect to the database
  await prismaWrapper.connect();

  const port = 3000;

  const app = express();
  app.use(express.json());
  app.use(logRequest);
  app.use("/v1", v1Routes);
  app.listen(port, () => {
    console.log("Listening on port " + port);
  });
};

start();
