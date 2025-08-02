import { BackgroundEclipses } from "@/components/BackgroundEclipses";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex items-center justify-center dark:bg-gray-900">
      <BackgroundEclipses />
      {children}
    </main>
  );
}