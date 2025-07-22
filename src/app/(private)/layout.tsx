export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main className="">{children}</main>
      </body>
    </html>
  );
}