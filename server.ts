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
        from: '"RityXTech Notification" <rityxtech@gmail.com>', // MUST be verified domain
        to: 'rityxtech@gmail.com',
        replyTo: email, // Set visitor email as reply to
        subject: `Portfolio Notification`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #6366f1; margin-top: 0; font-size: 20px;">RityXTech Portfolio</h2>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">You have received a new inquiry from your website.</p>
            
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${name}</p>
              <p style="margin: 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></p>
            </div>
            
            <h4 style="color: #334155; margin-bottom: 10px; font-size: 14px;">Message:</h4>
            <div style="background-color: #ffffff; padding: 16px; border-left: 4px solid #6366f1; color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${message}</div>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">Securely routed via Brevo Serverless Function</p>
          </div>
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
