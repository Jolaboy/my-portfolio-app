'use client';

import { useState } from 'react';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactStatus = null | { loading?: boolean; ok?: boolean; error?: string };

type ContactFormProps = {
  apiUrl?: string;
};

export default function ContactForm({ apiUrl }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<ContactStatus>(null);

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

      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const maybeError = (data as { error?: string } | null)?.error;
        throw new Error(maybeError || 'Failed to send');
      }

      setStatus({ ok: true });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
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
          className="w-full rounded-md border border-gray-300 p-2"
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
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </label>
      <label className="grid gap-1">
        <div className="text-sm font-bold">Subject</div>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 p-2"
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
          className="w-full rounded-md border border-gray-300 p-2"
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
