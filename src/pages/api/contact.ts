import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import type { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

import type { NextApiResponseServerIO } from '../../types/next';

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { name, email, subject, message } = (req.body || {}) as ContactBody;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'name, email and message are required' });
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    res.status(500).json({ error: 'smtp_not_configured' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br/>');
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  const mailOptions = {
    from: `${name} <${email}>`,
    to: TO_EMAIL || SMTP_USER,
    subject: subject || `New message from portfolio: ${name}`,
    text: message,
    html: `<p>${safeMessageHtml}</p><hr/><p>From: ${safeName} &lt;${safeEmail}&gt;</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    const payload = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
    };

    const resWithIO = res as NextApiResponseServerIO;
    if (!resWithIO.socket.server.io) {
      const httpServer = resWithIO.socket.server as unknown as HTTPServer;
      resWithIO.socket.server.io = new IOServer(httpServer, {
        path: '/api/socketio',
        addTrailingSlash: false,
      });
    }

    resWithIO.socket.server.io.emit('new_message', payload);

    res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'failed to send message';
    // eslint-disable-next-line no-console
    console.error('Mail error', err);
    res.status(500).json({ error: 'failed_to_send_message', details: message });
  }
}
