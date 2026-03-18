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

    const smtpUser = process.env.SMTP_USER || "rityxtech@surepicker.com"; // Assumed sender login
    const smtpPass = process.env.SMTP_PASSWORD || "WtZTmm2clADmZlua1vNki7JemPNIrOtE";
    const recipientEmail = process.env.RECIPIENT_EMAIL || "rityxtech@surepicker.com";

    try {
      // Configure Nodemailer for Sender.net SMTP
      const transporter = nodemailer.createTransport({
        host: "smtp.sender.net",
        port: 587, // STARTTLS
        secure: false, // Must be false for port 587
        auth: {
          user: smtpUser, // e.g., rityxtech@surepicker.com
          pass: smtpPass, // WtZTmm2clADmZlua1vNki7JemPNIrOtE
        },
      });

      // Send the mail
      const info = await transporter.sendMail({
        from: `"RityXTech Portfolio" <${smtpUser}>`, // Must map to registered sender identity
        to: recipientEmail,
        replyTo: email, // Direct replies back to the site visitor's email
        subject: `New Contact Form Submission from ${name}`,
        text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      console.log("Email sent successfully: %s", info.messageId);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Nodemailer SMTP error:", error);
      res.status(500).json({ error: "Failed to send email via SMTP", details: error.message });
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
