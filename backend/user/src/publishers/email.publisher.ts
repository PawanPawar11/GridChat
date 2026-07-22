import { publishToQueue } from "../configs/connectRabbitMQ.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

export interface SendOtpEmailPayload {
  to: string;
  subject: string;
  text: string;
}

export const publishOtpEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  const emailPayload: SendOtpEmailPayload = {
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };

  await publishToQueue(AUTH_CONSTANTS.QUEUE_SEND_OTP, emailPayload);
};
