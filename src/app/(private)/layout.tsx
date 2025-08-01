export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
      <body className='bg-login'>
        <main className="">{children}</main>
      </body>
  );
}