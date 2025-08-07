import { ModalCard } from "@/components/Modals/ModalCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="bg-background flex items-center justify-center flex-col gap-4 h-screen">
            <ModalCard title="Erro 404" subtitle="Página não encontrada">
                <div className="text-center text-muted-foreground">
                    <p className="mb-4 font-bold">A página que você tentou acessar não existe ou foi movida.</p>

                    <Button asChild>
                        <Link href="/">Voltar para a página inicial</Link>
                    </Button>
                </div>
            </ModalCard>
        </div>
    );
}
