import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

import type { NextApiResponseServerIO } from '../../types/next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (process.env.NETLIFY) {
    res.status(501).json({ error: 'realtime_not_supported_on_netlify' });
    return;
  }

  if (res.socket.server.io) {
    res.status(200).end();
    return;
  }

  const httpServer: HTTPServer = (res.socket as unknown as { server: HTTPServer }).server;

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
