import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Md Umair Uz Zaman — Generative AI Engineer',
  description: 'Generative AI engineer with a product mindset. Explore Umair Zaman’s work in agentic workflows, intelligent QA, and practical AI automation.',
  openGraph: { title: 'Umair Zaman — AI Engineer', description: 'Practical AI systems. Agentic workflows. Product thinking.', type: 'website' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
