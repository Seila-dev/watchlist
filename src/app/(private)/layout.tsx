export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex items-center justify-center">
      {children}
    </main>
  );
}