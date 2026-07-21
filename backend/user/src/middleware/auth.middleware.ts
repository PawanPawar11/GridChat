import type { NextFunction, Request, Response } from "express";
import { User, type IUser } from "../model/User.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Unauthorized: Please provide a valid authorization token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorized: Authorization token missing" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decodedToken || !decodedToken.id) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
