import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/customErrors.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const issueMessages = err.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({
      message: issueMessages || "Invalid input data",
      errors: err.issues,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
};
