import { Background } from "@/components/Backgrounds/BackgroundEclipses";

export const metadata = {
  title: "Entrar ou Criar Conta - Watchlist",
  description:
    "Acesse sua conta ou cadastre-se no Watchlist para organizar filmes, séries, livros e animes em um só lugar. Progresso sincronizado e interface intuitiva.",
  keywords:
    "login watchlist, criar conta watchlist, cadastro watchlist, entrar watchlist, organizar filmes, acompanhar séries, ler livros, animes, entretenimento digital",
  openGraph: {
    title: "Watchlist - Entrar ou Criar Conta",
    description:
      "Entre na sua conta Watchlist ou registre-se gratuitamente. Centralize seu entretenimento digital: filmes, séries, livros e animes em um só lugar.",
    url: "https://your-watchlist.vercel.app/login",
    siteName: "Watchlist",
    images: [
      {
        url: "/assets/logos/openGraph-OnlyLogo.webp",
        width: 400,
        height: 400,
        alt: "Watchlist - Entrar ou Criar Conta",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Watchlist - Entrar ou Criar Conta",
    description:
      "Acesse sua conta ou registre-se no Watchlist. Organize filmes, séries, livros e animes em um só lugar.",
    image: ["/assets/logos/openGraph-OnlyLogo.webp"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/logos/icon-purple-logo.webp",
  },
};


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex items-center justify-center">
      <Background />
      {children}
    </main>
  );
}