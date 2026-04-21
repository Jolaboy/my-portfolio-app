import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * App Router root layout.
 *
 * Sets global metadata and loads global CSS.
 */
export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio website',
  icons: {
    icon: ['/favicon.svg'],
  },
};

/** Wraps all pages with the root HTML/body shell. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
