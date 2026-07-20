import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { createClient } from "redis";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("Failed to resolve REDIS_URL from Environment Variables.");
}

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("🔴 Redis connected successfully!"))
  .catch((err) => console.error(err));

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default redisClient;
