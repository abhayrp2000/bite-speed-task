import { Response } from "express";

export class CustomError extends Error {
  statusCode: number;
  code: string;
  constructor(statusCode: number, error: { code: string; message: string }) {
    const { code, message } = error;
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends Error {
  static statusCode: number = 400;

  code: string;
  constructor(error: { code: string; message: string }) {
    const { code, message } = error;
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
  }
}

export class NotFoundError extends Error {
  static statusCode: number = 404;

  code: string;
  constructor(error: { code: string; message: string }) {
    const { code, message } = error;
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
  }
}

export const handleError = (err: any) => {
  if (err instanceof CustomError) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    };
  } else if (err instanceof NotFoundError) {
    return {
      statusCode: NotFoundError.statusCode,
      code: err.code,
      message: err.message,
    };
  } else if (err instanceof ValidationError) {
    return {
      statusCode: ValidationError.statusCode,
      code: err.code,
      message: err.message,
    };
  } else {
    return {
      statusCode: 500,
      code: `EC-001`,
      message: "Something went wrong, Please try again! Meh :(",
    };
  }
};
