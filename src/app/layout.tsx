import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nicole Valerio | Fotografía Profesional & Digital Studio',
  description: 'Estudio de fotografía profesional y experiencias digitales de alta gama. Bodas, retratos, maternidad y marca personal.',
  keywords: ['fotografia profesional', 'estudio fotografico', 'next.js', 'bodas', 'retratos', 'galeria digital'],
  openGraph: {
    title: 'Nicole Valerio | Fotografía Profesional',
    description: 'Fotografía de momentos que importan, personas reales y la belleza de lo cotidiano.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
