'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/** Props for the admin panel (optional API base for non-local deployments). */
type AdminPanelProps = {
  apiUrl?: string;
};

/** Payload shape emitted by the server when a new contact message arrives. */
type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  info?: unknown;
};

/**
 * Live message viewer for contact form submissions.
 *
 * Implementation notes:
 * - Uses Socket.IO to receive server-emitted `new_message` events.
 * - Disabled by default on Netlify because long-lived WebSocket servers are not supported.
 */
export default function AdminPanel({ apiUrl }: AdminPanelProps) {
  // Optional base URL for deployments where API is hosted separately.
  const base = apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';

  const [realtimeDisabled, setRealtimeDisabled] = useState<boolean | null>(null);
  const [disabledReason, setDisabledReason] = useState<'env' | 'netlify' | 'websocket' | null>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Allow disabling via env var (useful for static hosts) or by known Netlify hostname.
    const disabledByEnv = process.env.NEXT_PUBLIC_DISABLE_LIVE_MESSAGES === 'true';
    const disabledByHost = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
    const disabledByWebSocket = typeof WebSocket === 'undefined';

    let reason: 'env' | 'netlify' | 'websocket' | null = null;
    if (disabledByEnv) reason = 'env';
    else if (disabledByHost) reason = 'netlify';
    else if (disabledByWebSocket) reason = 'websocket';

    setDisabledReason(reason);
    setRealtimeDisabled(Boolean(reason));
  }, []);

  useEffect(() => {
    if (realtimeDisabled === null) return;
    if (realtimeDisabled) return;

    let socket: ReturnType<typeof io> | null = null;

    (async () => {
      // Ensure the Socket.IO server is initialized (no-op if already started).
      const socketInitUrl = base ? `${base.replace(/\/$/, '')}/api/socket` : '/api/socket';
      await fetch(socketInitUrl).catch(() => null);

      // Connect to the Socket.IO server. We allow polling fallback for environments
      // where WebSocket upgrades are blocked.
      socket = base
        ? io(base, { path: '/api/socketio', transports: ['websocket', 'polling'] })
        : io({ path: '/api/socketio', transports: ['websocket', 'polling'] });

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      socket.on('new_message', (m: ContactMessage) => setMessages((s) => [m, ...s]));
    })();

    return () => {
      socket?.disconnect();
    };
  }, [base, realtimeDisabled]);

  if (realtimeDisabled) {
    return (
      <div className="card mt-3">
        <div className="flex items-center justify-between">
          <h3 className="m-0">Live messages</h3>
          <div className="text-orange-600 text-sm">disabled</div>
        </div>
        <div className="mt-3 muted">
          {disabledReason === 'websocket' && (
            <>This browser doesn’t support WebSocket, so live message streaming is disabled. The contact form still works.</>
          )}
          {disabledReason === 'env' && (
            <>Live message streaming is disabled by configuration. The contact form still works.</>
          )}
          {(!disabledReason || disabledReason === 'netlify') && (
            <>Live message streaming (Socket.IO) isn’t supported on Netlify deployments. The contact form still works.</>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-3">
      <div className="flex items-center justify-between">
        <h3 className="m-0">Live messages</h3>
        <div className={connected ? 'text-green-700 text-sm' : 'text-orange-600 text-sm'}>{connected ? 'connected' : 'offline'}</div>
      </div>
      <div className="mt-3 grid gap-2">
        {messages.length === 0 && <div className="muted">No messages yet.</div>}
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-[var(--border)] p-2.5">
            <div className="font-bold">
              {m.name}{' '}
              <span className="ml-2 font-normal text-[var(--muted)]">{m.email}</span>
            </div>
            {m.subject && <div className="mt-1 font-semibold">{m.subject}</div>}
            <div className="mt-2 text-[var(--muted)]">{m.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
