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

    const senderApiToken = process.env.SENDER_API_TOKEN;

    if (!senderApiToken) {
      console.error("❌ SENDER_API_TOKEN is not set in local .env");
      return res.status(500).json({ error: "Server configuration error: missing email service token" });
    }

    try {
      const payload = {
        from: {
          email: 'info@rityxtech.com', // Sender.net authorized domain identity
          name: 'RityXTech Notification'
        },
        to: 'info@rityxtech.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h3>New website submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

      console.log("Local Express: Sending Payload via REST HTTP...");

      const response = await fetch("https://api.sender.net/v2/message/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${senderApiToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("❌ Local Express API Reject:", response.status, responseData);
        return res.status(response.status).json({ error: "Failed to send email", details: responseData });
      }

      console.log("✅ Local Express: Email sent successfully via REST API", responseData);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("❌ Error sending email:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
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
