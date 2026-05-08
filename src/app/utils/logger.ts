import winston from "winston";

const { combine, timestamp, json, colorize, printf, align } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  align(),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), json());

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "eco-track-backend" },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production" ? prodFormat : devFormat,
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: prodFormat,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: prodFormat,
    }),
  );
}

export default logger;
