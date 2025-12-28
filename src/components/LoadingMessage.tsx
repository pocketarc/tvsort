import clsx from "clsx";
import { HourglassIcon } from "lucide-react";
import type React from "react";

type Props = {
    children: React.ReactNode;
    className?: string | undefined;
    bg?: "light" | "dark";
    spin?: boolean;
};

export default function LoadingMessage({
    className,
    bg,
    children,
    spin,
}: Props) {
    spin = spin ?? true;
    bg = bg ?? "dark";

    return (
        <div className={className}>
            <HourglassIcon
                strokeWidth={1}
                className={clsx(
                    "h-32 w-32 mx-auto mb-8",
                    bg === "light" ? "text-stone-300" : "text-persian-800",
                    spin ? "animate-spin-slow" : "",
                )}
            />
            <div
                className={clsx(
                    "text-center text-2xl",
                    bg === "light"
                        ? "text-stone-400"
                        : "text-white text-shadow shadow-persian-900",
                )}
            >
                {children}
            </div>
        </div>
    );
}
