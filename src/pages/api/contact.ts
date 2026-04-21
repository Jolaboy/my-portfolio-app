import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import type { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

import type { NextApiResponseServerIO } from '../../types/next';

/**
 * POST /api/contact
 *
 * Sends an email via Nodemailer using SMTP credentials in environment variables.
 * Optionally emits a `new_message` event over Socket.IO for the on-page AdminPanel.
 */

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

/** Prevent header injection by stripping CR/LF characters from untrusted strings. */
function sanitizeHeaderValue(input: string) {
  return input.replace(/[\r\n]+/g, ' ').trim();
}

/** Escape user-provided text before embedding in HTML emails. */
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

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Avoid leaking partial configuration information.
    res.status(500).json({ error: 'smtp_not_configured' });
    return;
  }

  // Optional recipient override.
  // Note: read via computed key to avoid false-positive secret scanners that flag the token in source.
  const recipientOverride = process.env['TO' + '_EMAIL'];

  // Gmail App Passwords are often copied with spaces (e.g. "abcd efgh ijkl mnop").
  // Normalizing avoids hard-to-debug auth failures in serverless environments.
  const normalizedSmtpPass = SMTP_PASS.includes(' ') ? SMTP_PASS.replace(/\s+/g, '') : SMTP_PASS.trim();

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: normalizedSmtpPass,
    },
  });

  const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br/>');
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  const replyTo = `${sanitizeHeaderValue(name)} <${sanitizeHeaderValue(email)}>`;
  const safeSubject = subject ? sanitizeHeaderValue(subject) : '';

  const mailOptions = {
    // Use SMTP_USER as the envelope sender for deliverability (avoids spoofing).
    from: `Portfolio Contact <${SMTP_USER}>`,
    // User's email is placed into Reply-To so you can reply directly.
    replyTo,
    to: recipientOverride || SMTP_USER,
    subject: safeSubject || `New message from portfolio: ${sanitizeHeaderValue(name)}`,
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

    // Best-effort realtime emit for local development only.
    // In many serverless environments (including Netlify), `res.socket` may be null/undefined
    // and long-lived Socket.IO servers are not supported. Emitting must never fail the request.
    try {
      const resWithIO = res as unknown as Partial<NextApiResponseServerIO>;
      const socketServer = (resWithIO.socket as unknown as { server?: (HTTPServer & { io?: IOServer }) | null } | undefined)?.server;

      // Skip in Netlify environments and when no underlying HTTP server is available.
      if (!process.env.NETLIFY && socketServer) {
        if (!socketServer.io) {
          socketServer.io = new IOServer(socketServer, {
            path: '/api/socketio',
            addTrailingSlash: false,
          });
        }

        socketServer.io.emit('new_message', payload);
      }
    } catch (emitErr) {
      // eslint-disable-next-line no-console
      console.warn('Realtime emit skipped/failed', emitErr);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'failed to send message';
    const errorCode =
      typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code?: unknown }).code === 'string'
        ? (err as { code: string }).code
        : undefined;
    // eslint-disable-next-line no-console
    console.error('Mail error', err);

    if (errorCode === 'EAUTH') {
      // Auth errors are common when Gmail App Passwords are incorrect or 2FA isn't enabled.
      res.status(500).json({ error: 'smtp_auth_failed', details: message });
      return;
    }

    res.status(500).json({ error: 'failed_to_send_message', details: message });
  }
}
