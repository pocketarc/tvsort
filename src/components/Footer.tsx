import Link from "next/link";
import { intervalToDuration } from "date-fns";
import clsx from "clsx";

type Props = {
    comparisonsLeft?: number;
};

export default function Footer({ comparisonsLeft }: Props) {
    const secondsLeft = comparisonsLeft ? comparisonsLeft * 5 : 0;
    const duration = intervalToDuration({ start: 0, end: secondsLeft * 1000 });

    const hours = duration.hours ?? 0;
    let minutes = hours * 60 + (duration.minutes ?? 0);

    if (minutes < 2) {
        minutes = 2;
    }

    const formattedDuration = `${minutes} minutes`;

    return (
        <div className="w-full mx-auto bg-persian-900 p-4">
            <div className="text-white text-center text-xs sm:text-sm">
                {comparisonsLeft !== undefined && <>~{formattedDuration} left &middot; </>}
                Built <span className={clsx(comparisonsLeft ? "hidden sm:inline-block" : "")}>with 🩵</span> by{" "}
                <Link href="https://pocketarc.com" className="underline underline-offset-4">
                    PocketArC
                </Link>{" "}
                <span className={clsx(comparisonsLeft ? "hidden sm:inline-block" : "")}>
                    with data from{" "}
                    <Link href="https://www.themoviedb.org" className="underline underline-offset-4">
                        TMDB
                    </Link>{" "}
                </span>
                &middot;{" "}
                <Link href="/about" className="underline underline-offset-4">
                    About
                </Link>{" "}
                &middot;{" "}
                <Link href="https://twitter.com/pocketarc" className="underline underline-offset-4">
                    Twitter
                </Link>
            </div>
        </div>
    );
}
