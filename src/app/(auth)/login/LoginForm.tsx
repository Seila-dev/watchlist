import Image from "next/image";
import Logo from "../../../../public/assets/logos/watchlist-logo-white.webp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye } from "phosphor-react";
import Link from "next/link";

export function LoginForm() {
  return (
    <form
      action=""
      className="flex flex-col gap-4 bg-gray-900/20 w-[580px] h-[750px] rounded-2xl backdrop-blur-3xl border border-gray-800 p-8 "
    >
      <Image
        src={Logo}
        alt="Watchlist Logo"
        sizes="medium"
        className="mx-auto"
        width={125}
        height={24}
      />
      <hr className="border-gray-800/50" />
      <div className="flex justify-start flex-col mb-8">
        <h1 className="font-semibold text-primary-50 text-[28px]">Entrar</h1>
        <h5 className="text-gray-500">Entre na sua conta Watchlist.</h5>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex gap-2 flex-col">
          <Label htmlFor="email" className="text-primary-50">
            Email
          </Label>
          <Input type="email" id="email" placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="password" className="text-primary-50">
            Senha
          </Label>
          <Input type="email" id="email" placeholder="Digite sua senha" />
          {/* adicionar icon <Eye/> */}

          <Link href={"/"} className="text-gray-500 text-sm text-right">
            Esqueceu sua senha?
          </Link>
        </div>
        <Button className="text-primary-50 font-semibold">Entrar</Button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <hr className="flex-1 border-t border-gray-800" />
        <p className="text-gray-500 text-sm">Ou</p>
        <hr className="flex-1 border-t border-gray-800" />
      </div>

      <Button
        variant={"outline"}
        className="flex items-center text-primary-50 font-semibold mb-8 border-gray-800"
      >
        Entrar com Google
      </Button>
      <hr className="border-gray-800/50 mb-8" />

      <div className="flex items-center justify-between">
        <h5 className="text-[14px] text-gray-500">Não tem uma conta?</h5>
        <Link href={"/register"}>
          <Button
            variant={"outline"}
            className="font-semibold text-[16px] text-primary-50 border-gray-800"
          >
            Cadastre-se gratuitamente
          </Button>
        </Link>
      </div>
    </form>
  );
}
