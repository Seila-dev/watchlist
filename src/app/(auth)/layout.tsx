import { Background } from "@/components/Backgrounds/BackgroundEclipses";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex items-center justify-center">
      <Background />
      {children}
    </main>
  );
}