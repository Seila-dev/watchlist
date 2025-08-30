import { Header } from "@/components/Header/Header";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex flex-col items-center justify-center">
      <Header />
      {children}
    </div>
  );
}