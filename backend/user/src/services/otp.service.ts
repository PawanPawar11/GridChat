import { redisClient } from "../configs/connectRedis.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";
import {
  BadRequestError,
  TooManyRequestsError,
} from "../errors/customErrors.js";
import { publishOtpEmail } from "../publishers/email.publisher.js";

export class OtpService {
  public static async requestOtp(email: string): Promise<void> {
    const rateLimitKey = AUTH_CONSTANTS.REDIS_KEY_RATE_LIMIT(email);
    const isRateLimited = await redisClient.get(rateLimitKey);

    if (isRateLimited) {
      throw new TooManyRequestsError("Too many requests, please try again later");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = AUTH_CONSTANTS.REDIS_KEY_OTP(email);

    await redisClient.set(otpKey, otp, { EX: AUTH_CONSTANTS.OTP_TTL_SECONDS });
    await redisClient.set(rateLimitKey, "true", {
      EX: AUTH_CONSTANTS.RATE_LIMIT_TTL_SECONDS,
    });

    await publishOtpEmail(email, otp);
  }

  public static async verifyOtp(email: string, otp: string): Promise<void> {
    const otpKey = AUTH_CONSTANTS.REDIS_KEY_OTP(email);
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestError("OTP has expired or is invalid");
    }

    await redisClient.del(otpKey);
  }
}
