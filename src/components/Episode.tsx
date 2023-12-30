import type { Episode as EpisodeType } from "@/utils/types";
import { intlFormat } from "date-fns/intlFormat";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";

type Props = {
    episode: EpisodeType;
    standing?: number;
};

export default function Episode({ episode, standing }: Props) {
    const firstTwoImages = episode.images.slice(0, 2);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex">
                {standing && (
                    <div className="mr-4">
                        <span className="text-5xl font-bold text-stone-300">{standing}</span>
                    </div>
                )}
                <div>
                    <h2 className="flex text-3xl font-title text-stone-900">
                        {episode.imdb_id && (
                            <Link target="_blank" href={`https://www.imdb.com/title/${episode.imdb_id}`}>
                                <span className="flex-grow">{episode.title}</span>
                                <ExternalLinkIcon strokeWidth={1} className="inline-block -mt-1 ml-2 h-6 w-6 text-stone-500" />
                            </Link>
                        )}
                        {!episode.imdb_id && <span className="flex-grow">{episode.title}</span>}
                    </h2>
                    <p className="-mt-1 text-sm text-stone-500">
                        S{episode.season}.E{episode.number}
                        {episode.first_aired_at && <span className="ml-2 text-stone-400">{intlFormat(episode.first_aired_at)}</span>}
                    </p>
                </div>
            </div>
            {episode.plot_points.length === 0 && <p className="text-sm text-stone-900">{episode.description}</p>}
            {episode.plot_points.length > 0 && (
                <ul className="sm:divide-y sm:divide-stone-200 text-sm text-stone-900">
                    {episode.plot_points.map((plotPoint) => (
                        <li key={plotPoint} className="sm:py-2">
                            {plotPoint}
                        </li>
                    ))}
                </ul>
            )}
            <ul className="grid grid-cols-2 gap-4">
                {firstTwoImages.map((image) => (
                    <div key={image}>
                        <Image src={image} className="rounded-md" width={300} height={225} alt="" />
                    </div>
                ))}
            </ul>
        </div>
    );
}
