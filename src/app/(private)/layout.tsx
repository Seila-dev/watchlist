import { Header } from "@/components/Header/Header";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex flex-col items-center justify-center">
      <Header />
      {children}
    </main>
  );
}