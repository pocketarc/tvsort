export default function getShowImage(title: string, image: string | null): string {
    if (image) {
        if (image.startsWith("https://")) {
            return image;
        } else {
            return `https://image.tmdb.org/t/p/w342/${image}`;
        }
    }

    const urlName = encodeURIComponent(title);
    return `https://images.placeholders.dev/?width=342&height=513&text=${urlName}&fontWeight=300&textWrap=true&bgColor=#f7f6f6&textColor=#6d6e71`;
}
