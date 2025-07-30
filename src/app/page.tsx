"use client"

import { SmileyNervous } from "phosphor-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <h1 className="text-black text-4xl">HOME PAGE</h1>
      <SmileyNervous width={50} height={50}/>
    </div>
  );
}
