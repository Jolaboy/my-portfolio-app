'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type AdminPanelProps = {
  apiUrl?: string;
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  info?: unknown;
};

export default function AdminPanel({ apiUrl }: AdminPanelProps) {
  const base = apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';

  const [realtimeDisabled, setRealtimeDisabled] = useState<boolean | null>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const disabledByEnv = process.env.NEXT_PUBLIC_DISABLE_LIVE_MESSAGES === 'true';
    const disabledByHost = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
    setRealtimeDisabled(disabledByEnv || disabledByHost);
  }, []);

  useEffect(() => {
    if (realtimeDisabled === null) return;
    if (realtimeDisabled) return;

    let socket: ReturnType<typeof io> | null = null;

    (async () => {
      const socketInitUrl = base ? `${base.replace(/\/$/, '')}/api/socket` : '/api/socket';
      await fetch(socketInitUrl).catch(() => null);

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
          Live message streaming (Socket.IO) isn’t supported on Netlify deployments. The contact form still works.
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
