import { BackgroundEclipses } from '@/components/Backgrounds/BackgroundEclipses';
import { BackgroundTestIphone } from '@/components/Backgrounds/BackgroundTestIphone';
import './globals.css';
import ClientAuthProvider from '@/contexts/ClientAuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Toaster } from 'sonner';

export const metadata = {
  title: "Watchlist",
  description : "Watchlist facilita sua vida centralizando o consumo de entretenimento digital. Registre o que você assiste ou lê, sincronize seu progresso e nunca mais perca o fio da meada.",
  keywords: "watchlist, organizar filmes, acompanhar séries, ler livros, animes, entretenimento digital, interface intuitiva",
  openGraph: {
    title: "Watchlist - Sua central de entretenimento digital",
    description: "Centralize filmes, séries, livros e animes em um só lugar com Watchlist. Interface intuitiva, progresso sincronizado e controle total da sua privacidade.",
    url: "https://your-watchlist.vercel.app",
    siteName: "Watchlist",
    images: [
      {
        url: "/assets/logos/openGraph-OnlyLogo.webp",
        width: 400,
        height: 400,
        alt: "Watchlist - Organize e acompanhe seu entretenimento",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Watchlist - Organize e acompanhe seus filmes, séries, livros e animes",
    description:
      "Centralize seu entretenimento digital com Watchlist. Fácil, rápido e seguro.",
    image: ["/assets/logos/openGraph-OnlyLogo.webp"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/logos/icon-purple-logo.webp",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ClientAuthProvider>
            <Toaster />
            <div>
              <BackgroundTestIphone />
              {children}
            </div>
          </ClientAuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}