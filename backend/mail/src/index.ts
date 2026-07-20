import express from "express";
import dotenv from "dotenv";
import sendOtpConsumer from "./sendOtpConsumer.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3001;

await sendOtpConsumer();

app.get("/", (_, res) => {
  res.send("Mail service is running!");
});

app.get("/health", (_, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
