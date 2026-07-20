import express from "express";
import { requestOtp } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post("/otp", requestOtp);

export default userRouter;
