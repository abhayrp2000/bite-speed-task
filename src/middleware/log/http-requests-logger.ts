import { NextFunction, Response, Request } from "express";
import { randomUUID } from "crypto";
import { Logger } from "./logger";
const logger = new Logger();

let responseBody: string | undefined = undefined;

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = randomUUID();
    req.requestId = requestId;

    logger.http(`[REQ] [${req.requestId}] [${req.method}] - ${req.url}`, {
      ...req.body,
    });

    const [oldWrite, oldEnd] = [res.write, res.end];
    const chunks: Buffer[] = [];

    (res.write as unknown) = function (chunk: any) {
      chunks.push(Buffer.from(chunk));
      (oldWrite as Function).apply(res, arguments);
    };

    //@ts-ignore
    res.end = function (chunk) {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }
      const body = Buffer.concat(chunks).toString("utf8");
      responseBody = body;
      (oldEnd as Function).apply(res, arguments);
    };

    const cleanup = () => {
      res.removeListener("finish", logFn);
      res.removeListener("close", abortFn);
      res.removeListener("error", errorFn);
    };

    const logFn = () => {
      cleanup();
      logger.http(
        `[RES] [${req.requestId}] [${req.method}] - ${req.url} - ${res.statusCode} - ${responseBody}`
      );
    };

    const abortFn = () => {
      cleanup();
      logger.http(
        `[RES] [${req.requestId}] [${req.method}] - ${req.url} - Request aborted by the user`
      );
    };

    const errorFn = (err: any) => {
      cleanup();
      logger.http(
        `[${req.requestId}] [${req.method}] - ${req.url} Error: ${err}`
      );
    };

    res.on("finish", logFn);
    res.on("close", abortFn);
    res.on("error", errorFn);

    next();
  } catch (err) {
    console.log(err);
    next();
  }
};
