import { typeid } from "typeid-js";
import { redirect, RedirectType } from "next/navigation";

export default function Page({ params: { id } }: { params: { id: string } }) {
    const matrixId = typeid("matrix").toString();
    redirect(`/show/${id}/${matrixId}`, RedirectType.replace);

    // @ts-expect-error This is a redirect page, so we don't need to return anything.
    return <></>;
}
