import { BackgroundEclipses } from '@/components/Backgrounds/BackgroundEclipses';
import './globals.css';
import ClientAuthProvider from '@/contexts/ClientAuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Toaster } from 'sonner';

export const metadata = {
  title: 'Watchlist',
  description: 'Seu repo, sua vida!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ClientAuthProvider>
            <Toaster />
            <div>
              <BackgroundEclipses />
              {children}
            </div>
          </ClientAuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}