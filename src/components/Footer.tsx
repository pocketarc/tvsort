import Link from "next/link";

type Props = {
    comparisonsLeft?: number;
};

export default function Footer({ comparisonsLeft }: Props) {
    return (
        <div className="w-full mx-auto bg-persian-900 p-4">
            <div className="text-white text-center text-xs sm:text-sm">
                {comparisonsLeft !== undefined && <>~{comparisonsLeft} left &middot;</>}
                <Link href="https://pocketarc.com">Built with ❤️ by PocketArC</Link> &middot; <Link href="/about">About</Link> &middot;{" "}
                <Link href="https://twitter.com/pocketarc">Twitter</Link>
            </div>
        </div>
    );
}
