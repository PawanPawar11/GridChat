import express from "express";
import {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateName,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import authRouter from "./auth.route.js";

const userRouter = express.Router();

userRouter.use(authRouter);

userRouter.get("/my-profile", isAuthenticated, asyncHandler(getMyProfile));
userRouter.get("/user/all", isAuthenticated, asyncHandler(getAllUsers));
userRouter.get("/user/:id", isAuthenticated, asyncHandler(getUserById));
userRouter.put("/user/update", isAuthenticated, asyncHandler(updateName));

export default userRouter;
