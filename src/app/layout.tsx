import { BackgroundEclipses } from '@/components/BackgroundEclipses';
import './globals.css';
import ClientAuthProvider from '@/contexts/ClientAuthProvider';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Watchlist',
  description: 'Seu repo, sua vida!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientAuthProvider>
          <Toaster />
          <div>
            <BackgroundEclipses />
            {children}
          </div>
        </ClientAuthProvider>
      </body>
    </html>
  );
}