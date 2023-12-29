import Link from "next/link";
import clsx from "clsx";

type Props = {
    showTitleOnMobile?: boolean;
    showSubtitle?: boolean;
    title?: string;
    subtitle?: string;
};

export default function Header({ title, subtitle, showSubtitle, showTitleOnMobile }: Props) {
    showTitleOnMobile = showTitleOnMobile ?? true;
    showSubtitle = showSubtitle ?? true;
    title = title ?? "TV Sort";
    subtitle = subtitle ?? "Which episode is -actually- your favourite? 🤔";

    return (
        <div className="flex flex-shrink flex-col bg-persian-700">
            <Link href="/" className="text-center p-4 sm:p-8">
                <h1
                    className={clsx(
                        "font-title truncate text-white text-3xl sm:text-7xl leading-snug text-shadow shadow-persian-950",
                        showTitleOnMobile ? "" : "hidden sm:block",
                    )}
                >
                    📺 {title} 📺
                </h1>
                {showSubtitle && <h2 className="-mt-1 text-white truncate sm:text-2xl text-shadow shadow-persian-900">{subtitle}</h2>}
            </Link>
        </div>
    );
}
