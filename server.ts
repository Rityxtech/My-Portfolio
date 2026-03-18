import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Validate critical environment variables at startup
if (!process.env.SMTP_PASSWORD) {
  console.warn("⚠️ SMTP_PASSWORD is not set. Using provided hardcoded credentials, but it is recommended to set this in .env");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || "a557e1001@smtp-brevo.com",
          pass: process.env.SMTP_KEY,
        },
      });

      console.log("Local Express: Sending Payload via Brevo SMTP...");

      const info = await transporter.sendMail({
        from: '"RityXTech Notification" <info@rityxtech.com>', // MUST be verified domain
        to: 'info@rityxtech.com',
        replyTo: email, // Set visitor email as reply to
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h3>New website submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });

      console.log("✅ Local Express: Email sent successfully via Brevo SMTP", info.messageId);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("❌ SMTP Delivery Failure:", {
        message: error.message,
        code: error.code,
        response: error.response,
        command: error.command
      });
      res.status(500).json({ error: "Failed to send email. Check server logs.", details: error.response || error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
