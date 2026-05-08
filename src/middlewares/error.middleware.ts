import { Request, Response, NextFunction } from "express";
import logger from "../app/utils/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  if (statusCode >= 500) {
    logger.error(message, {
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn(message, {
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
