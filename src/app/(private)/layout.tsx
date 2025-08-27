import { Header } from "@/components/Header/Header";
import Nav from "@/components/Nav/Nav";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex flex-col items-center justify-center">
      <Header />
      <Nav />
      {children}
    </main>
  );
}