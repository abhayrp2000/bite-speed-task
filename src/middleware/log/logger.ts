import { getLoggerFormatedDate } from "../../utils";

class Logger {
  info(message: any, data?: any) {
    if (data) {
      console.log(
        `${getLoggerFormatedDate()} | INFO | ${message} | ${JSON.stringify(
          data
        )}`
      );
    } else {
      console.log(`${getLoggerFormatedDate()} | INFO | ${message}`);
    }
  }

  error(message: any, data?: any) {
    if (data) {
      console.log(
        `${getLoggerFormatedDate()} | ERROR | ${message} | ${JSON.stringify(
          data
        )}`
      );
    } else {
      console.log(`${getLoggerFormatedDate()} | ERROR | ${message}`);
    }
  }

  http(message: any, data?: any) {
    if (data) {
      console.log(
        `${getLoggerFormatedDate()} | HTTP | ${message} | ${JSON.stringify(
          data
        )}`
      );
    } else {
      console.log(`${getLoggerFormatedDate()} | HTTP | ${message}`);
    }
  }
}

export { Logger };
