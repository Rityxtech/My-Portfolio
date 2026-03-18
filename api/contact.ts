import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS setup if frontend & backend ever differ
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ensure POST specifically
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
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

        console.log("Transmission initialized. Sending Payload via Brevo SMTP...");

        const info = await transporter.sendMail({
            from: '"My Portfolio" <rityxtech@gmail.com>', // MUST be verified domain in Brevo
            to: 'rityxtech@gmail.com', // Admin inbox
            replyTo: email, // Reply directly to the submitter
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
        `,
        });

        console.log("✅ Email sent successfully via Brevo SMTP:", info.messageId);
        return res.status(200).json({ message: 'Message sent successfully' });

    } catch (error: any) {
        console.error("❌ Action Failed:", {
            message: error.message,
            code: error.code,
            response: error.response,
            command: error.command
        });
        return res.status(500).json({ error: 'Failed to send message', details: error.response || error.message });
    }
}
