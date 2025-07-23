export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}