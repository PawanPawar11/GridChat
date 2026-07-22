import express from "express";
import { requestOtp, verifyOtp } from "../controller/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  requestOtpSchema,
  verifyOtpSchema,
} from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = express.Router();

authRouter.post(
  "/request-otp",
  validate(requestOtpSchema),
  asyncHandler(requestOtp),
);

authRouter.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  asyncHandler(verifyOtp),
);

export default authRouter;
