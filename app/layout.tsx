import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Archit Jha · Design Engineer',
  description:
    'Archit Jha, a one-person design engineer and marketing motion designer. Brand, product, motion and code, from sketch to shipped.',
  icons: {
    icon: 'data:,',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="gate">
      <head>
        <link
          rel="preload"
          href="/fonts/geist-latin-var.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
