import type { Request, Response } from "express";
import { redisClient } from "../configs/connectRedis.js";
import { publishToQueue } from "../configs/connectRabbitMQ.js";
import { User } from "../model/User.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;
    const isRateLimited = await redisClient.get(rateLimitKey);

    if (isRateLimited) {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    const emailPayload = {
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    const SEND_OTP_QUEUE = "send_otp_email";

    await publishToQueue(SEND_OTP_QUEUE, emailPayload);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }

    const otpKey = `otp:${email}`;

    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "OTP has expired or is invalid" });
    }

    await redisClient.del(otpKey);

    let currentUser = await User.findOne({ email: email });

    if (!currentUser) {
      const username = email.split("@")[0];
      currentUser = await User.create({
        name: username,
        email: email,
      });
    }

    const accessToken = generateAccessToken(currentUser);

    res
      .status(200)
      .json({ message: "User & OTP verified successfully", accessToken });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};
