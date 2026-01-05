import { BackgroundHome } from "@/components/Backgrounds/BackgroundEclipseHome";
import { Header } from "@/components/Header/Header";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      <Header />
      <BackgroundHome />
      {children}
    </div>
  );
}