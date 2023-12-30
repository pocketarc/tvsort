import ShowSorterContainer from "@/components/ShowSorterContainer";

type Params = { id: string; matrix: string };

export default async function Page({ params: { id, matrix: matrixId } }: { params: Params }) {
    return <ShowSorterContainer id={id} matrixId={matrixId} />;
}
