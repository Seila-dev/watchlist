"use client";
import Image from "next/image";
import Logo from "../../../public/assets/logos/watchlist-header-logo.png";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { User, Bell } from "phosphor-react";
import { Button } from "../ui/button";

const links = [
  {
    label: "Ínicio",
    href: "/",
  },
  {
    label: "Álbum de conteúdos",
    href: "/contents",
  },
  {
    label: "Favoritos",
    href: "/favorites",
  },
  {
    label: "Comunidade",
    href: "/community",
    icon: ArrowUpRight,
  },
];

export function Header() {
  return (
    // ta quebrando o layout !!!
    <header className="bg-background flex items-center justify-between py-4 px-10 border-b border-gray-800 min-w-full">
      <Link href="/">
        <Image src={Logo} alt="Watchlist Logo" width={125} height={24} />
      </Link>

      <nav className="flex items-center gap-12 text-gray-400">
        {links.map(({ label, href, icon: Icon }) => (
          
          <Link
            key={href}
            href={href}
            className="flex items-center hover:text-white duration-300 transition-all gap-2"
          >
            {label}
            {Icon && <Icon size={20} />}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 flex-shrink-0">
        {/* adicionar funcionalidade onClick() no Button */}
        <Button className="text-white w-[121px]" variant={"default"}>
          <Plus />
          Adicionar
        </Button>
        <span className="flex items-center gap-3">
          {/* notificações */}
          <Bell
            size={25}
            className="text-gray-400 hover:text-white duration-300 cursor-pointer"
          />
          {/* perfil do usuário */}
          <User
            size={25}
            className="text-gray-400 hover:text-white duration-300 cursor-pointer"
          />
        </span>
      </div>
    </header>
  );
}
