import { HourglassIcon } from "lucide-react";
import React from "react";

type Props = {
    children: React.ReactNode;
    className?: string | undefined;
};

export default function LoadingMessage({ className, children }: Props) {
    return (
        <div className={className}>
            <HourglassIcon strokeWidth={1} className="h-32 w-32 mx-auto text-persian-800 animate-spin-slow mb-8" />
            <div className="text-white text-center text-2xl text-shadow shadow-persian-900">{children}</div>
        </div>
    );
}
