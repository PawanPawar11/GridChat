import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { User } from "../model/User.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user = req.user;
  res.status(200).json({ user });
};

export const updateName = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user = await User.findById(req.user?._id);
  const { name } = req.body;

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  user.name = name;
  await user.save();

  const token = generateAccessToken(user);

  res.status(200).json({ message: "Name updated successfully", user, token });
};

export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const users = await User.find();
  res.status(200).json({ users });
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ user });
};
