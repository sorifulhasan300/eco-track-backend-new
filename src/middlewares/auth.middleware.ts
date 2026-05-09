import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../app/utils/app.error";
import { TUser } from "../types/user.interface";

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader);
      if (!authHeader) {
        throw new AppError(401, "You are not authorized!");
      }

      // Strip "Bearer " prefix if present
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as TUser;

      const { role } = decoded;

      if (requiredRoles.length && !requiredRoles.includes(role as string)) {
        throw new AppError(403, "You have no permission to access this route");
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
