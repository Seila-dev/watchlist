import React from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ModalCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode; //Precisa ser do tipo ReactNode para aceitar componentes;
    className?: string;
}

export function ModalCard({ title, subtitle, children, className = "" }: ModalCardProps) {
    return (
        <Card className="bg-primary-600 w-full max-w-md p-5">

            <CardHeader className="">
                <div className="flex flex-col items-center justify-center gap-6 mb-4">
                    <Image
                        alt="watchlist-logo"
                        src={'/assets/logos/watchlist-logo-white.webp'}
                        width={150}
                        height={80}
                        priority
                    />

                    <span className="h-0.5 w-[90%] opacity-40 bg-gray-400"></span>
                </div>

                <div className="text-white flex flex-col items-start justify-start gap-3 font-semiboldbold text-2xl">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-gray-50">{subtitle}</CardDescription>
                </div>

            </CardHeader>

            <CardContent className="flex flex-col gap-2 text-white">
                {children}
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-between gap-3">
                <div className="flex  w-full justify-between items-center gap-2">
                    <span className="h-0.5 w-[70%] opacity-40 bg-gray-400"></span>
                    <span className="text-white font-bold">ou</span>
                    <span className="h-0.5 w-[70%] opacity-40 bg-gray-400"></span>
                </div>
                <div className="flex flex-col gap-6">
                    <Button className="bg-white font-bold">
                        Continue com o Google
                    </Button>
                    <span className="text-gray-100 text-sm">
                        By clicking "Create account" above, you acknowledge that you will receive
                        updates from the Watchlist team and that you have read, understood, and
                        agreed to Terms & Conditions and
                        Privacy Policy.
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
