// Express app configuration (middlewares, routes)
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { apiLimiter } from "./middlewares/limiter.middleware";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { BaseRouter } from "./routes/router";

const app: Application = express();

// --- 1. Security & Optimization Middlewares ---
app.use(helmet()); // Security headers set kore
app.use(compression()); // Response size komay (Performance requirement)

// --- 2. CORS Configuration ---
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// --- 3. Body Parser ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 4. Rate Limiter (Requirement) ---
app.use("/api", apiLimiter);

// --- 5. Health Check ---
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running....." });
});

// Import and use your routes here
app.use("/api/v1", BaseRouter);

// --- 404 Not found Handling
app.use(notFoundHandler);

// --- 7. Sentry Error Handler (must be before globalErrorHandler)
// Sentry.setupExpressErrorHandler(app);

// --- 8. Error Handling
app.use(globalErrorHandler);

export default app;
