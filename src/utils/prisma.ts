import { PrismaClient } from "@prisma/client";
import { CustomError } from "./custom-error";
import { logger } from "..";

class PrismaWrapper {
  private _prismaClient?: PrismaClient;

  get prismaClient() {
    if (!this._prismaClient) {
      console.error(`Error connecting to DB`);
      throw new Error("Server Error");
    }

    return this._prismaClient;
  }

  async connect() {
    this._prismaClient = new PrismaClient({
      datasources: {
        db: { url: process.env.POSTGRES_URL },
      },
    });

    await this._prismaClient.$connect();
    logger.info(`POSTGRES CONNECTED`);
  }

  async disconnect() {
    this._prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.POSTGRES_URL,
        },
      },
    });

    await this._prismaClient.$disconnect();
    logger.info(`POSTGRES DISCONNECTED`);
  }
}

export const prismaWrapper = new PrismaWrapper();
