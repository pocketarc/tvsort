import ShowSorterContainer from "@/components/ShowSorterContainer";
import getKnex from "@/utils/getKnex";
import { getShowStateInternal } from "@/utils/getShowStateInternal";

type Params = { id: string; matrix: string };

export default async function Page({ params: { id, matrix: matrixId } }: { params: Params }) {
    const knex = getKnex();
    const initialState = await getShowStateInternal(knex, id, matrixId);

    return <ShowSorterContainer initialState={initialState} matrixId={matrixId} />;
}
