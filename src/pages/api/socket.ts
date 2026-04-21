import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

import type { NextApiResponseServerIO } from '../../types/next';

/**
 * Socket.IO bootstrap endpoint.
 *
 * Visiting /api/socket starts the Socket.IO server (attached to the underlying HTTP server).
 * The client then connects using the `/api/socketio` path.
 */

export const config = {
  api: {
    // Socket.IO expects to manage the HTTP request stream itself.
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (process.env.NETLIFY) {
    // Netlify serverless functions do not support long-lived socket servers.
    res.status(501).json({ error: 'realtime_not_supported_on_netlify' });
    return;
  }

  // Some serverless runtimes do not expose a Node HTTP server via `res.socket.server`.
  // Without it, Socket.IO cannot be attached.
  const httpServerMaybe = (res.socket as unknown as { server?: HTTPServer | null } | null)?.server;
  if (!httpServerMaybe) {
    res.status(501).json({ error: 'realtime_not_supported' });
    return;
  }

  if (res.socket.server.io) {
    // Server already initialized.
    res.status(200).end();
    return;
  }

  const httpServer: HTTPServer = httpServerMaybe;

  const io = new IOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log('Socket connected:', socket.id);
    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Socket disconnected:', socket.id);
    });
  });

  res.status(201).end();
}
