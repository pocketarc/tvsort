# TV Sort

TV Sort is a tool to help you find your favourite episode of a TV show. It uses a human-driven [sorting algorithm](https://en.wikipedia.org/wiki/Sorting_algorithm) to compare episodes against each other and find the best one.

I built this over Christmas 2020 while discussing the best episodes of [Frasier](https://en.wikipedia.org/wiki/Frasier) with my family. It's hard to answer the question "what's your favourite episode?" because there are so many episodes, and so many of them are great. It's much easier to answer the question "which of these two episodes is better?" and then repeat that question a bunch of times until you have a sorted list.

If you have any questions, comments, or feedback, please [tweet at me](https://twitter.com/pocketarc) or [send me an email](mailto:hello@pocketarc.com).

## Technical Details

TV Sort is built with [Next.js](https://nextjs.org/). The source code is available under the AGPLv3 license.

TV Sort was heavily inspired by [Leonid Shevtsov's MonkeySort](https://leonid.shevtsov.me/post/a-human-driven-sort-algorithm-monkeysort/) algorithm, which I love and have used countless times for my own ad-hoc lists. The algorithm allows you to compare two items at a time and then uses that information to sort the entire list.

Your choices are saved in your browser's local storage, so you can come back to the list later and continue sorting, which is important, since most TV shows have -a lot- of episodes. Even the best sorting algorithm is going to take a while to sort 200 episodes, so you'll probably want to come back to it later.

Choices are also sent to the server, anonymously, so that I can build a database of episode rankings. This will allow us to build a list of the best episodes of a show, as ranked by all users, without the usual 1/10 or 5/5 star ratings that are typically used and mean different things to different people.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.