import Footer from "@/components/Footer";
import Image from "next/image";
import tmdb from "../../../public/tmdb.svg";
import Link from "next/link";
import Header from "@/components/Header";

export default function Page() {
    return (
        <main className="flex flex-col bg-persian-700 min-h-full">
            <div className="flex-grow flex flex-col">
                <Header />
                <div className="flex-grow bg-white p-8 sm:p-16">
                    <div className="prose max-w-3xl mx-auto">
                        <h2 className="text-3xl font-title text-stone-900">About</h2>
                        <p>
                            TV Sort is a tool to help you find your favourite episode of a TV show. It uses a human-driven{" "}
                            <Link href="https://en.wikipedia.org/wiki/Sorting_algorithm">sorting algorithm</Link> to compare episodes against each other and
                            find the best one.
                        </p>
                        <p>
                            I built this over Christmas 2023 while discussing the best episodes of <abbr title="Best TV show ever.">Frasier</abbr> with my
                            family. It&apos;s hard to answer the question &ldquo;what&apos;s your favourite episode?&rdquo; because there are so many episodes,
                            and so many of them are great. It&apos;s much easier to answer the question &ldquo;which of these two episodes is better?&rdquo; and
                            then repeat that question a bunch of times until you have a sorted list.
                        </p>
                        <p>
                            If you have any questions, comments, or feedback, please <Link href="https://twitter.com/pocketarc">tweet at me</Link> or{" "}
                            <Link href="mailto:hello@pocketarc.com">send me an email</Link>.
                        </p>
                        <h2 className="text-3xl font-title text-stone-900">Technical Details</h2>
                        <p>
                            TV Sort is open source and available on <a href="https://github.com/pocketarc/tvsort">GitHub</a>. It&apos;s built with{" "}
                            <Link href="https://nextjs.org/">Next.js</Link>. The source code is available under the AGPLv3 license.
                        </p>
                        <p>
                            TV Sort was heavily inspired by{" "}
                            <Link href="https://leonid.shevtsov.me/post/a-human-driven-sort-algorithm-monkeysort/">Leonid Shevtsov&apos;s MonkeySort</Link>{" "}
                            algorithm, which I love and have used countless times for my own ad-hoc lists. The algorithm allows you to compare two items at a
                            time and then uses that information to sort the entire list.
                        </p>
                        <p>
                            Your choices are saved in your browser&apos;s local storage, so you can come back to the list later and continue sorting, which is
                            important, since most TV shows have -a lot- of episodes. Even the best sorting algorithm is going to take a while to sort 200
                            episodes, so you&apos;ll probably want to come back to it later.
                        </p>
                        <p>
                            Choices are also sent to the server, anonymously, so that I can build a database of episode rankings. This will allow us to build a
                            list of the best episodes of a show, as ranked by all users, without the usual 1/10 or 5/5 star ratings that are typically used and
                            mean different things to different people.
                        </p>
                        <h2 className="text-3xl font-title text-stone-900">Attribution</h2>
                        <p>
                            TV Sort uses the TMDB API but is not endorsed or certified by TMDB. I use the TMDB API to search for TV shows and get the episode
                            lists for those shows. I also use the TMDB API to get the poster images for each episode, as well as links to IMDB.
                        </p>
                        <p>
                            <Image src={tmdb} width={143} height={12} alt="TMDB logo" />
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
