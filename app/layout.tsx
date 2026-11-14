import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Civic Air Quality Briefing Studio | AI Environmental Intelligence',
  description:
    'Production-ready Civic Air Quality Briefing Studio powered by Gemini 2.5 Flash for raw data normalization, role-based action intelligence, longitudinal comparative analysis, and multilingual citizen advisories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
