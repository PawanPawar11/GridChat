import amqplib from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const sendOtpConsumer = async () => {
  try {
    const connection = await amqplib.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: parseInt(process.env.RABBITMQ_PORT || "5672"),
      username: process.env.RABBITMQ_USER || "guest",
      password: process.env.RABBITMQ_PASSWORD || "1234567890",
      vhost: process.env.RABBITMQ_VHOST || "/",
    });

    const channel = await connection.createChannel();
    const queueName = "send_otp_email";

    await channel.assertQueue(queueName, { durable: true });

    console.log(`⏳ Waiting for messages in queue: ${queueName}`);

    channel.consume(
      queueName,
      async (message) => {
        if (message) {
          const payload = message.content.toString();
          console.log(`📩 Received message: ${payload}`);

          // Parse the message content to get the email and OTP
          const { to, subject, text } = JSON.parse(payload);

          // Send the OTP email using nodemailer
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.example.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER || "user@example.com",
              pass: process.env.SMTP_PASSWORD || "password",
            },
          });

          try {
            await transporter.sendMail({
              from: process.env.SMTP_USER || "user@example.com",
              to: to,
              subject: subject,
              text: text,
            });
            console.log(`✅ OTP email sent to: ${to}`);
            channel.ack(message); // Acknowledge the message after successful processing
          } catch (error) {
            console.error("❌ Failed to send OTP email:", error);
          }
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
  }
};

export default sendOtpConsumer;
