'use client';

import { useState } from 'react';

/** Local form model for the contact form UI. */
type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/** Tracks submission status for button state + inline feedback. */
type ContactStatus = null | { loading?: boolean; ok?: boolean; error?: string };

/** Optional props for customizing where requests are sent. */
type ContactFormProps = {
  apiUrl?: string;
};

/**
 * Contact form that POSTs to `/api/contact`.
 *
 * When deployed, you can point to a different API host via `NEXT_PUBLIC_API_URL` or `apiUrl`.
 */
export default function ContactForm({ apiUrl }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<ContactStatus>(null);

  // `apiUrl` prop takes precedence over NEXT_PUBLIC_API_URL.
  const base = apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  const endpoint = base ? `${base.replace(/\/$/, '')}/api/contact` : '/api/contact';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name as keyof ContactFormData]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // The API usually responds with JSON. Some platforms may return HTML/plain-text
      // for 500 errors, so we parse defensively and surface helpful info to users.
      const parsed = await res
        .clone()
        .json()
        .then((json) => ({ kind: 'json' as const, json }))
        .catch(async () => ({ kind: 'text' as const, text: await res.text().catch(() => '') }));

      if (!res.ok) {
        const maybeError =
          parsed.kind === 'json' && parsed.json && typeof parsed.json === 'object'
            ? (parsed.json as { error?: string; details?: string }).error
            : undefined;

        const maybeDetails =
          parsed.kind === 'json' && parsed.json && typeof parsed.json === 'object'
            ? (parsed.json as { details?: string }).details
            : parsed.kind === 'text'
              ? parsed.text
              : undefined;

        const details = typeof maybeDetails === 'string' ? maybeDetails.trim().slice(0, 200) : '';
        throw new Error(`${maybeError || `HTTP_${res.status}`}${details ? `: ${details}` : ''}`);
      }

      setStatus({ ok: true });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // Convert unknown exceptions into a readable string.
      setStatus({ ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <label className="grid gap-1">
        <div className="text-sm font-bold">Name</div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-[var(--border)] bg-[var(--elev)] p-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1">
        <div className="text-sm font-bold">Email</div>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-[var(--border)] bg-[var(--elev)] p-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1">
        <div className="text-sm font-bold">Subject</div>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-md border border-[var(--border)] bg-[var(--elev)] p-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1">
        <div className="text-sm font-bold">Message</div>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full rounded-md border border-[var(--border)] bg-[var(--elev)] p-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
        />
      </label>

      <div className="flex items-center gap-2">
        <button type="submit" className="btn btn-primary" disabled={status?.loading}>
          {status?.loading ? 'Sending…' : 'Send Message'}
        </button>
        {status?.ok && <div className="text-green-700">Message sent — thanks!</div>}
        {status && status.ok === false && <div className="text-red-700">{status.error}</div>}
      </div>
    </form>
  );
}
