import type { Request, Response } from "express";
import { redisClient } from "../config/connectRedis.js";
import { publishToQueue } from "../config/connectRabbitMQ.js";

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
