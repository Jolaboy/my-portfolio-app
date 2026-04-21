'use client';

import { useEffect, useState } from 'react';

type CompatibilityIssue = {
  id: string;
  message: string;
};

type CompatibilityReport = {
  ok: boolean;
  issues: CompatibilityIssue[];
  details: {
    userAgent?: string;
    viewport?: { width: number; height: number; dpr: number };
    features: Record<string, boolean>;
  };
};

function buildCompatibilityReport(): CompatibilityReport {
  const features: Record<string, boolean> = {
    // Core runtime capabilities for modern Next.js apps.
    promise: typeof Promise !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    abortController: typeof AbortController !== 'undefined',
    formData: typeof FormData !== 'undefined',
    url: typeof URL !== 'undefined',
    matchMedia: typeof window !== 'undefined' && typeof window.matchMedia === 'function',
    cssSupports: typeof CSS !== 'undefined' && typeof CSS.supports === 'function',
  };

  const issues: CompatibilityIssue[] = [];

  if (!features.promise) issues.push({ id: 'promise', message: 'Missing Promise support.' });
  if (!features.fetch) issues.push({ id: 'fetch', message: 'Missing fetch() support (needed for the contact form).' });
  if (!features.abortController) issues.push({ id: 'abortController', message: 'Missing AbortController support.' });
  if (!features.formData) issues.push({ id: 'formData', message: 'Missing FormData support.' });
  if (!features.url) issues.push({ id: 'url', message: 'Missing URL support.' });
  if (!features.matchMedia) issues.push({ id: 'matchMedia', message: 'Missing matchMedia support (used for responsive behavior).' });

  // CSS.supports is a nice-to-have; don’t fail compatibility solely on it.

  const report: CompatibilityReport = {
    ok: issues.length === 0,
    issues,
    details: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      viewport:
        typeof window !== 'undefined'
          ? { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio ?? 1 }
          : undefined,
      features,
    },
  };

  return report;
}

/**
 * Minimal device/browser compatibility check.
 *
 * - Renders nothing on compatible browsers.
 * - Shows a small warning only when required features are missing.
 * - Always logs a compatibility report to the console for debugging.
 */
export default function CompatibilityNotice() {
  const [report, setReport] = useState<CompatibilityReport | null>(null);

  useEffect(() => {
    const r = buildCompatibilityReport();
    setReport(r);

    // Avoid noisy logs in production unless there is an issue.
    if (!r.ok) {
      // eslint-disable-next-line no-console
      console.warn('[compat] Issues detected', r);
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[compat] OK', r.details);
    }
  }, []);

  if (!report || report.ok) return null;

  return (
    <div className="container" role="alert" aria-live="polite">
      <div className="card">
        <strong>Compatibility notice</strong>
        <p className="muted">
          Your browser/device may be missing features required for the best experience. Updating to a modern browser should fix this.
        </p>
        <ul className="muted">
          {report.issues.map((issue) => (
            <li key={issue.id}>{issue.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
