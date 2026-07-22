import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user = req.user;
  res.status(200).json({ user });
};
