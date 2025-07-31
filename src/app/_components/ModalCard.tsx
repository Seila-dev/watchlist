import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

interface ModalCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode; //Precisa ser do tipo ReactNode para aceitar componentes;
    className?: string;
}

export function ModalCard({ title, subtitle, children}: ModalCardProps) {
    return (
        <Card className="bg-card w-full max-w-[480px] p-5 border-0">

            <CardHeader>
                <div className="flex flex-col items-center justify-center gap-6 mb-4">
                    <Image
                        alt="watchlist-logo"
                        src={'/assets/logos/watchlist-logo-white.webp'}
                        width={120}
                        height={50}
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
        </Card>
    );
}
