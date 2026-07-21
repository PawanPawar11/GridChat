import express from "express";
import {
  getMyProfile,
  requestOtp,
  verifyOtp,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/request-otp", requestOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.get("/my-profile", isAuthenticated, getMyProfile);

export default userRouter;
