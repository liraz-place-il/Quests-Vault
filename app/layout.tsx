import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/shared/Providers';

export const metadata: Metadata = {
  title: 'Quest Vault',
  description: 'A searchable archive of quest outputs and assets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
