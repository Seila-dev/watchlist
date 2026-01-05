"use client";
import Image from "next/image";
import Logo from "../../../public/assets/logos/watchlist-header-logo.png";
import Link from "next/link";
import { ArrowUpRight, Menu, Plus } from "lucide-react";
import { User, Bell } from "phosphor-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Início",
    href: "/home",
  },
  {
    label: "Álbum de conteúdos",
    href: "/contents",
  },
  // {
  //   label: "Comunidade",
  //   href: "/community",
  //   icon: ArrowUpRight,
  // },
];

export function Header() {
  const pathname = usePathname();

  return (
    // Concertando responsivo.
    <header className="bg-background flex items-center justify-between py-4 px-3 sm:px-10 border-b border-gray-900/50 min-w-full">
      <Link href="/home" className="">
        <Image src={Logo} alt="Watchlist Logo" loading="eager" width={125} height={24} />
      </Link>

      <nav className="hidden lg:flex items-center gap-12 text-gray-400">
        {links.map(({ label, href, 
        //icon: Icon
         }) => (
          
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 duration-300 transition-all
              ${pathname === href
                ? "text-white font-semibold"
                : "text-gray-400 hover:text-white"
              }`}
          >
            {label}
            {/* {Icon && <Icon size={20} />} */}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 flex-shrink-0">
        {/* adicionar funcionalidade onClick() no Button */}
        <Button className="text-white hidden sm:flex" variant={"default"}>
          <Plus />
          Adicionar
        </Button>
        <span className="flex items-center gap-3">
          {/* notificações */}
          <Bell
            size={45}
            opacity={0.8}
            className="text-gray-400 hover:text-white border border-gray-800 p-3 duration-300 cursor-pointer rounded-md"
          />
          {/* perfil do usuário */}
          <User
            size={45}
            opacity={0.8}
            className="text-gray-400 hover:text-white border border-gray-800 p-3 duration-300 cursor-pointer rounded-md"
          />
          {/* Menu burguer */}
          <Menu
            size={25}
            opacity={0.8}
            className="flex lg:hidden text-gray-400 hover:text-white duration-300 cursor-pointer"
          />
        </span>
      </div>
    </header>
  );
}
