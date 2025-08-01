import './globals.css';
import ClientAuthProvider from '@/contexts/ClientAuthProvider';
import { Toaster } from 'sonner';
import { BackgroundEclipses } from '../components/BackgroundEclipses';

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