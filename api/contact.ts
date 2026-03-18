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
            from: '"RityXTech AI Notification" <info@rityxtech.com>', // MUST be verified domain in Brevo
            to: 'rityxtech@gmail.com', // Admin inbox
            replyTo: email, // Reply directly to the submitter
            subject: `New website submission from ${name}`,
            html: `
        <h3>New website submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
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
