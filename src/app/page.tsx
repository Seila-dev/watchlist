"use client"

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <Image
        alt="teste"
        src={'/assets/logos/watchlist-logo-dark.webp'}
        width={150}
        height={80}
      />
      <h1 className="text-black text-5xl font-bold">HOME PAGE</h1>
    </div>
  );
}
