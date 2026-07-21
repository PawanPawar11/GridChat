import amqplib from "amqplib";

let channel: amqplib.Channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: parseInt(process.env.RABBITMQ_PORT || "5672"),
      username: process.env.RABBITMQ_USER || "guest",
      password: process.env.RABBITMQ_PASSWORD || "1234567890",
      vhost: process.env.RABBITMQ_VHOST || "/",
    });
    channel = await connection.createChannel();
    console.log("🐇 RabbitMQ connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
    process.exit(1);
  }
};
export default connectRabbitMQ;

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not initialized. Please call connectRabbitMQ() first.",
    );
  }

  return channel;
};

export const publishToQueue = async (queueName: string, payload: unknown) => {
  const channel = getChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
};
