"use client";

import { useFormState } from "react-dom";
import { findShows } from "@/server/findShows";
import SelectShow from "@/components/SelectShow";

export default function SelectShowContainer() {
    const [state, formAction] = useFormState(findShows, {
        shows: [],
        query: null,
    });

    return (
        <form className="w-full max-w-3xl p-4" action={formAction}>
            <SelectShow state={state} />
        </form>
    );
}
