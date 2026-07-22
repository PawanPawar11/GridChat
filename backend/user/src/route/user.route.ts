import express from "express";
import { getMyProfile } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import authRouter from "./auth.route.js";

const userRouter = express.Router();

userRouter.use(authRouter);

userRouter.get("/my-profile", isAuthenticated, asyncHandler(getMyProfile));

export default userRouter;
