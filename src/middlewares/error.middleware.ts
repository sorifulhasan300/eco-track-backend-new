import { Request, Response, NextFunction } from "express";
import logger from "../app/utils/logger";
import { Prisma } from "../generated/prisma/client";

const handlePrismaError = (
  err: any,
): { statusCode: number; message: string } => {
  // Known Request Error — wrong data, constraint violation, etc.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        const field = (err.meta?.target as string[])?.join(", ");
        return {
          statusCode: 409,
          message: `Duplicate entry: '${field}' already exists.`,
        };

      case "P2003":
        return {
          statusCode: 400,
          message: `Invalid reference: Related record not found.`,
        };

      case "P2025":
        return { statusCode: 404, message: `Record not found.` };

      case "P2014":
        return {
          statusCode: 400,
          message: `Invalid relation: The change violates a required relation.`,
        };

      case "P2016":
        return { statusCode: 400, message: `Query interpretation error.` };

      case "P2021":
        return {
          statusCode: 500,
          message: `Table does not exist. Run 'prisma migrate'.`,
        };

      case "P2022":
        return {
          statusCode: 500,
          message: `Column does not exist. Run 'prisma migrate'.`,
        };

      default:
        return { statusCode: 400, message: `Database error. [${err.code}]` };
    }
  }

  // Validation Error — wrong data type passed to Prisma
  if (err instanceof Prisma.PrismaClientValidationError) {
    const match = err.message.match(/Argument `(\w+)`[^.]+\./);
    const field = match ? match[1] : "unknown field";
    return { statusCode: 400, message: `Invalid value for field: '${field}'.` };
  }

  // Initialization Error — DB connection failed
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 503,
      message: `Database connection failed. Please try again later.`,
    };
  }

  // Rust Panic / Unexpected engine error
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return {
      statusCode: 500,
      message: `Critical database engine error. Please restart the server.`,
    };
  }

  // Unknown Request Error
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return { statusCode: 500, message: `Unknown database error occurred.` };
  }

  return { statusCode: 500, message: "Something went wrong" };
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ── Prisma Error Detection ────────────────────────────────────────────────
  const isPrismaError =
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError;

  let statusCode: number;
  let message: string;

  if (isPrismaError) {
    const prismaErr = handlePrismaError(err);
    statusCode = prismaErr.statusCode;
    message = prismaErr.message;
  } else {
    statusCode = err.statusCode || 500;
    message = err.message || "Something went wrong";
  }
  const isKnownError = err instanceof Prisma.PrismaClientKnownRequestError;

  if (statusCode >= 500) {
    logger.error(message, {
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ...(isKnownError && { prismaCode: err.code, prismaMetaData: err.meta }),
    });
  } else {
    logger.warn(message, {
      statusCode,
      path: req.path,
      method: req.method,
      ...(isKnownError && { prismaCode: err.code }),
    });
  }

  // ── Response ──────────────────────────────────────────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      ...(isKnownError && { prismaCode: err.code, prismaMetaData: err.meta }),
    }),
  });
};
