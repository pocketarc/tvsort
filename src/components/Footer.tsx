import Link from "next/link";
import { intervalToDuration } from "date-fns";

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
                <Link href="https://pocketarc.com">Built with 🩵 by PocketArC</Link> &middot; <Link href="/about">About</Link> &middot;{" "}
                <Link href="https://twitter.com/pocketarc">Twitter</Link>
            </div>
        </div>
    );
}
