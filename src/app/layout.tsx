import ClientAuthProvider from '@/contexts/ClientAuthProvider';
import './globals.css';
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
          <div>{children}</div>
        </ClientAuthProvider>
      </body>
    </html>
  );
}