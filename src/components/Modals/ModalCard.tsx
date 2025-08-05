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
    children: React.ReactNode; 
    className?: string;
}

export function ModalCard({ title, subtitle, children}: ModalCardProps) {
    return (
        <Card className="bg-gray-900 w-full max-w-[550px] border border-gray-800">

            <CardHeader>
                <div className="flex flex-col items-center justify-center gap-6 mb-4">
                    <Image
                        alt="watchlist-logo"
                        src={'/assets/logos/watchlist-logo-white.webp'}
                        width={120}
                        height={50}
                        priority
                    />

                    <span className="h-0.5 w-[100%] opacity-40 bg-gray-700"></span>
                </div>

                <div className="text-gray-100 flex flex-col items-start justify-start gap-3 font-semiboldbold text-2xl">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-gray-500 text-lg">{subtitle}</CardDescription>
                </div>

            </CardHeader>

            <CardContent className="flex flex-col gap-2 text-white">
                {children}
            </CardContent>
        </Card>
    );
}
