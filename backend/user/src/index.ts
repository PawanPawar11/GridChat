import express from "express";
import dotenv from "dotenv";

import connectDB from "./configs/connectDB.js";
import connectRedis from "./configs/connectRedis.js";
import connectRabbitMQ from "./configs/connectRabbitMQ.js";

import userRouter from "./route/user.route.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
await connectRedis();
await connectRabbitMQ();

app.use(express.json());
app.use("/api/v1", userRouter);

app.get("/", (_, res) => {
  res.send("User service is running!");
});

app.get("/health", (_, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
