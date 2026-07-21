import jwt, { type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import type { IUser } from "../model/User.js";

dotenv.config();

export const generateAccessToken = (user: IUser) => {
  const payload = {
    id: user._id,
  };

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Failed to resolve JWT_SECRET from Environment Variables.");
  }

  const jwtOptions: SignOptions = { expiresIn: "7d" };

  return jwt.sign(payload, jwtSecret, jwtOptions);
};
