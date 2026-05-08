import { Server } from "http";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  let server: Server;

  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    server = app.listen(PORT, () => {
      console.log(`🚀 EcoTrack Server is running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (error) => {
      console.log(" Unhandled Rejection detected, shutting down...");
      //   logger.error("Unhandled Rejection", { error });

      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    if (server) {
      server.close();
    }
  });
}

bootstrap();
