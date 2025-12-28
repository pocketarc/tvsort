import { intlFormat } from "date-fns/intlFormat";
import { AlertCircle, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Episode as EpisodeType } from "@/utils/types";

const PLACEHOLDER_PREFIX = "placeholder-";

function isPlaceholderEpisode(id: string): boolean {
    return id.startsWith(PLACEHOLDER_PREFIX);
}

type Props = {
    episode: EpisodeType;
    standing?: number;
};

export default function Episode({ episode, standing }: Props) {
    const firstTwoImages = episode.images.slice(0, 2);
    const isPlaceholder = isPlaceholderEpisode(episode.id);

    return (
        <div className={`flex flex-col space-y-4 ${isPlaceholder ? "opacity-60" : ""}`}>
            <div className="flex">
                {standing && (
                    <div className="mr-4">
                        <span className="text-5xl font-bold text-stone-300">{standing}</span>
                    </div>
                )}
                <div>
                    <h2
                        className={`flex text-3xl font-title ${isPlaceholder ? "text-stone-500 italic" : "text-stone-900"}`}
                    >
                        {episode.imdb_id && !isPlaceholder && (
                            <Link target="_blank" href={`https://www.imdb.com/title/${episode.imdb_id}`}>
                                <span className="flex-grow">{episode.title}</span>
                                <ExternalLinkIcon
                                    strokeWidth={1}
                                    className="inline-block -mt-1 ml-2 h-6 w-6 text-stone-500"
                                />
                            </Link>
                        )}
                        {(!episode.imdb_id || isPlaceholder) && (
                            <span className="flex-grow flex items-center gap-2">
                                {isPlaceholder && <AlertCircle className="h-6 w-6 text-stone-400" strokeWidth={1.5} />}
                                {episode.title}
                            </span>
                        )}
                    </h2>
                    <p className="-mt-1 text-sm text-stone-500">
                        S{episode.season}.E{episode.number}
                        {episode.first_aired_at && (
                            <span className="ml-2 text-stone-400">{intlFormat(episode.first_aired_at)}</span>
                        )}
                        {isPlaceholder && <span className="ml-2 text-stone-400">• Not yet available on TMDB</span>}
                    </p>
                </div>
            </div>
            {!isPlaceholder && episode.plot_points.length === 0 && (
                <p className="text-sm text-stone-900">{episode.description}</p>
            )}
            {!isPlaceholder && episode.plot_points.length > 0 && (
                <ul className="sm:divide-y sm:divide-stone-200 text-sm text-stone-900">
                    {episode.plot_points.map((plotPoint) => (
                        <li key={plotPoint} className="sm:py-2">
                            {plotPoint}
                        </li>
                    ))}
                </ul>
            )}
            {isPlaceholder && <p className="text-sm text-stone-500 italic">{episode.description}</p>}
            {!isPlaceholder && (
                <ul className="grid grid-cols-2 gap-4">
                    {firstTwoImages.map((image) => (
                        <div key={image}>
                            <Image src={image} className="rounded-md" width={300} height={169} alt="" />
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}
