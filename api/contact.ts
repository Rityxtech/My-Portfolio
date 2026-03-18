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

    // Create transporter using Sender.net SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.sender.net',
        port: 587,
        secure: false, // TLS via STARTTLS
        auth: {
            user: process.env.SENDER_EMAIL || 'info@rityxtech.com',
            pass: process.env.SENDER_PASSWORD, // Must be injected in Vercel Environment variables
        },
    });

    try {
        // Send email to admin inbox
        const info = await transporter.sendMail({
            from: `"RityXTech Portfolio" <${process.env.SENDER_EMAIL || 'info@rityxtech.com'}>`, // Strict mapping to registered sender identity
            to: 'info@rityxtech.com',
            replyTo: email, // Extremely useful: Replies route directly to the user who filled the form
            subject: `New Contact Form Message from ${name}`,
            html: `
        <h3>New website submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        console.log("Email sent successfully: %s", info.messageId);
        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error: any) {
        console.error('SMTP Payload Failure:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
}
