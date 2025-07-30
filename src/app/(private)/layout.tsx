export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
      <body>
        <main className="">{children}</main>
      </body>
  );
}