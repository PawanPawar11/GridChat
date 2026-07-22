import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { User, type IUser } from "../model/User.js";
import { UnauthorizedError } from "../errors/customErrors.js";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Unauthorized: Please provide a valid authorization token",
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Unauthorized: Authorization token missing");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decodedToken || !decodedToken.id) {
      throw new UnauthorizedError("Unauthorized: Invalid token");
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
