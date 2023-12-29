import { HourglassIcon } from "lucide-react";
import React from "react";
import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    className?: string | undefined;
    spin?: boolean;
};

export default function LoadingMessage({ className, children, spin }: Props) {
    spin = spin ?? true;

    return (
        <div className={className}>
            <HourglassIcon strokeWidth={1} className={clsx("h-32 w-32 mx-auto text-persian-800 mb-8", spin ? "animate-spin-slow" : "")} />
            <div className="text-white text-center text-2xl text-shadow shadow-persian-900">{children}</div>
        </div>
    );
}
