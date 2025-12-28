import { format } from "date-fns/format";
import Image from "next/image";
import Link from "next/link";
import type { ShowSummary } from "@/utils/types";

type Props = {
    shows: ShowSummary[];
};

export default function ListShows({ shows }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 my-4">
            {shows.map((show) => (
                <Link
                    key={show.id}
                    href={`/show/${show.id}`}
                    className="p-4 bg-persian-800/50 rounded-md"
                >
                    <Image
                        src={show.image}
                        width={342}
                        height={513}
                        alt={show.title}
                    />
                    <h2 className="mt-4 truncate font-title text-persian-50 text-xl leading-snug shadow-persian-950 text-shadow">
                        {show.title}
                    </h2>
                    {show.first_aired_at && (
                        <p className="text-xs text-persian-300">
                            {format(show.first_aired_at, "yyyy")}
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
}
