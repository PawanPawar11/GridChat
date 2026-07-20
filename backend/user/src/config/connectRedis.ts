import { createClient } from "redis";

let redisClient;

const connectRedis = async () => {
  const REDIS_URL = process.env.REDIS_URL;

  if (!REDIS_URL) {
    throw new Error("Failed to resolve REDIS_URL from Environment Variables.");
  }

  redisClient = createClient({
    url: REDIS_URL,
  });

  try {
    await redisClient.connect();
    console.log("🔴 Redis connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    process.exit(1);
  }
};

export { redisClient };
export default connectRedis;
