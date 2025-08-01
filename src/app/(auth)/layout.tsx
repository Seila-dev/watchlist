export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#121212] relative overflow-clip">
      <div className="absolute rounded-[100%] bg-indigo-700 w-[285px] h-[285px] blur-[200px] top-[-142px] lg:left-[550px] md:left-[300px]"></div>
      <div className="absolute rounded-[100%] bg-indigo-700 w-[354px] h-[354px] blur-[400px] top-[637px] lg:left-[460px]"></div>
      {children}
    </main>
  );
}
