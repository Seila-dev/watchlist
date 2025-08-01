export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-login flex items-center justify-center dark:bg-gray-900">
      {children}
    </main>
  );
}