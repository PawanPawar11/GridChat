export const AUTH_CONSTANTS = {
  OTP_TTL_SECONDS: 300, // 5 minutes
  RATE_LIMIT_TTL_SECONDS: 60, // 1 minute
  QUEUE_SEND_OTP: "send_otp_email",
  REDIS_KEY_OTP: (email: string) => `otp:${email}`,
  REDIS_KEY_RATE_LIMIT: (email: string) => `otp:ratelimit:${email}`,
} as const;
