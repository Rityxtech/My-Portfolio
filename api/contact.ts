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

    const senderApiToken = process.env.SENDER_API_TOKEN;

    if (!senderApiToken) {
        console.error("❌ SENDER_API_TOKEN is missing from Vercel Environment variables.");
        return res.status(500).json({ error: 'Server misconfiguration: API Token missing' });
    }

    try {
        const payload = {
            from: {
                email: 'info@rityxtech.com', // Must match your verified sender domain identity
                name: 'RityXTech AI Notification'
            },
            to: 'info@rityxtech.com', // Where it delivers TO (your admin inbox)
            subject: `New website submission from ${name}`,
            html: `
        <h3>New website submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        };

        console.log("Transmission initialized. Sending Payload:", JSON.stringify(payload, null, 2));

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
            console.error("❌ Sender.net API Rejected Request:", response.status, responseData);
            return res.status(response.status).json({
                error: 'SENDER_API_ERROR',
                details: responseData
            });
        }

        console.log("✅ Email sent successfully via REST API:", responseData);
        return res.status(200).json({ message: 'Message sent successfully' });

    } catch (error: any) {
        console.error('❌ Connection/Execution Failure:', error);
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
}
