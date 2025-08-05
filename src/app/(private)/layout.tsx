export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
      <body>
        <main>{children}</main>
      </body>
  );
}