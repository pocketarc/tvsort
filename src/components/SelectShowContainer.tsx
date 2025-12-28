"use client";

import type { FormEvent } from "react";
import SelectShow from "@/components/SelectShow";
import { useSearchShows } from "@/hooks/useSearchShows";

export default function SelectShowContainer() {
    const { query, shows, isPending, error, searchShows } = useSearchShows();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const queryValue = formData.get("query");
        if (typeof queryValue === "string" && queryValue.trim()) {
            searchShows(queryValue.trim());
        }
    };

    return (
        <form className="w-full max-w-3xl p-4" onSubmit={handleSubmit}>
            <SelectShow
                state={{ query, shows }}
                isPending={isPending}
                error={error}
            />
        </form>
    );
}
