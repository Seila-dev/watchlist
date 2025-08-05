import { ModalCard } from "@/components/Modals/ModalCard"
import { Button } from "@/components/ui/button"
import  { Label } from "@radix-ui/react-label"



export default function ForgotPassword() {
    return (
        <main className="bg-background flex items-center justify-center flex-col gap-4 h-screen">
            <ModalCard
                title="Esqueceu sua senha?"
                subtitle="Digite seu endereço de email abaixo e lhe enviaremos um
                        código para entrar e redefinir sua senha."
            >
                <form>
                    <Label className="mb-2" htmlFor="email">Email</Label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    <Button>
                        Enviar código
                    </Button>
                    </form>
            </ModalCard>
        </main>
    )
}