import Link from "next/link";
import { HourglassIcon } from "lucide-react";
import Header from "@/components/Header";

export default function Loading() {
    return (
        <main className="flex flex-col bg-persian-700 min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto">
                    <div className="-mt-8">
                        <HourglassIcon strokeWidth={1} className="h-32 w-32 mx-auto text-persian-800 animate-spin-slow mb-8" />
                        <div className="text-white text-center text-2xl text-shadow shadow-persian-900">
                            Loading the show&apos;s details.
                            <br />
                            If this is the first time we&apos;re loading this show, it might take a few minutes.
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mx-auto bg-persian-900 p-4">
                <div className="text-white text-center text-xs sm:text-sm">
                    <Link href="https://pocketarc.com">Built with ❤️ by PocketArC</Link> &middot; <Link href="https://pocketarc.com/blog/tvsort">About</Link>{" "}
                    &middot; <Link href="https://twitter.com/pocketarc">Twitter</Link>
                </div>
            </div>
        </main>
    );
}
