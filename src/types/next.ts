import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { NextApiResponse } from 'next';
import type { Server as IOServer } from 'socket.io';

/**
 * Extends Next's API Response type to include a Socket.IO server attached to the underlying
 * Node HTTP server instance.
 *
 * This is used by `/api/socket` and `/api/contact` to share a single Socket.IO instance.
 */
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};
