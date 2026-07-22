import type { Request, Response } from "express";
import { OtpService } from "../services/otp.service.js";
import { UserService } from "../services/user.service.js";

export const requestOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body;
  await OtpService.requestOtp(email);
  res.status(200).json({ message: "OTP sent successfully" });
};

export const verifyOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, otp } = req.body;
  await OtpService.verifyOtp(email, otp);

  const { accessToken } = await UserService.findOrCreateUser(email);

  res.status(200).json({
    message: "User & OTP verified successfully",
    accessToken,
  });
};
