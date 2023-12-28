export type Comparison = "<" | ">" | "=";

export type SortableObject = { id: string };

export class NeedUserInput<T extends SortableObject> extends Error {
    public a: T;
    public b: T;

    constructor(a: T, b: T) {
        super(`Need user input for sorting.`);
        this.a = a;
        this.b = b;
    }
}

type Key = string;

export class ComparisonMatrix<T extends SortableObject> {
    protected items: T[];
    public matrix: Record<Key, Record<Key, Comparison>>;
    public explicitCount: number;

    public constructor(items: T[], matrix: Record<Key, Record<Key, Comparison>> = {}, explicitCount = 0) {
        this.items = items;
        this.matrix = matrix as Record<Key, Record<Key, Comparison>>;
        this.explicitCount = explicitCount;

        items.forEach((item) => {
            const key: Key = item.id;

            if (this.matrix[key] === undefined) {
                this.matrix[key] = {} as Record<Key, Comparison>;
            }

            if (this.matrix[key]?.[key] === undefined) {
                // @ts-expect-error - It cannot be undefined; it's been set above.
                this.matrix[key][key] = "=";
            }
        });
    }

    public getComparisonsLeft(): number {
        const allKeys = this.items.map((item) => item.id);
        const keysMissing = [];

        for (const key of allKeys) {
            const subItems = this.matrix[key];
            if (subItems) {
                const keysCompared = Object.keys(subItems);

                for (const otherKey of allKeys) {
                    if (!keysCompared.includes(otherKey)) {
                        keysMissing.push([key, otherKey]);
                    }
                }
            }
        }

        return Math.ceil(keysMissing.length / 2);
    }

    protected opposite(value: Comparison) {
        return value == "=" ? "=" : value == "<" ? ">" : "<";
    }

    public get(a: T | undefined, b: T | undefined, failOnUnknown: boolean): Comparison {
        const keyA: Key | undefined = a?.id;
        const keyB: Key | undefined = b?.id;

        if (keyA && keyB && this.matrix[keyA]?.[keyB]) {
            // @ts-expect-error - It cannot be undefined; it's been shown to be defined above.
            return this.matrix[keyA][keyB];
        } else {
            if (failOnUnknown) {
                if (a && b) {
                    throw new NeedUserInput(a, b);
                } else {
                    throw new Error(`Cannot compare; a and/or b are not defined.`);
                }
            } else {
                return "=";
            }
        }
    }

    public set(a: T, b: T, value: Comparison) {
        const keyA: Key = a.id;
        const keyB: Key = b.id;

        this.explicitCount++;
        this.updateSingle(keyA, keyB, value);
        this.updateSingle(keyB, keyA, this.opposite(value));
    }

    protected updateSingle(a: Key, b: Key, value: Comparison) {
        // @ts-expect-error - It cannot be undefined; it was set when the matrix was created.
        this.matrix[a][b] = value;
        this.updateTransitive(a, b);
    }

    protected updateTransitive(a: Key, b: Key) {
        const subItemsA = this.matrix[a];
        const subItemsB = this.matrix[b];

        if (!subItemsA) {
            throw new Error(`Cannot update transitive; subItems is not defined for key: '${a}'.`);
        }

        if (!subItemsB) {
            throw new Error(`Cannot update transitive; subItems is not defined for key: '${b}'.`);
        }

        if (subItemsA[b] == "=") {
            // ((Cij = “=”) ⋀ (Cjk is known)) ⇒ Cik = Cjk
            Object.keys(subItemsB).forEach((c) => {
                // It can't be undefined; we're looping over it right now.
                const value = subItemsB[c] as Comparison;

                if (!subItemsA[c]) {
                    this.updateSingle(a, c, value);
                }
            });
        } else {
            // (Cij ∈ { “<”, “>”}) ⋀ (Cjk ∈ {Cij, “=”}) ⇒ Cik = Cij
            Object.keys(subItemsB).forEach((c) => {
                const value = subItemsA[b];

                if (value === undefined) {
                    throw new Error(`Cannot update transitive; value is not defined for ${b}/${c}.`);
                }

                if (!subItemsA[c] && (subItemsA[b] == subItemsB[c] || subItemsB[c] == "=")) {
                    this.updateSingle(a, c, value);
                }
            });
        }
    }
}

export function monkeySort<T extends SortableObject>(items: T[], matrix: ComparisonMatrix<T>, failOnUnknown: boolean = true) {
    const array = items;

    const part = (low: number, high: number) => {
        let i = low;
        let j = high;
        const x = array[Math.floor((low + high) / 2)];
        do {
            while (matrix.get(array[i], x, failOnUnknown) == ">") i++;
            while (matrix.get(array[j], x, failOnUnknown) == "<") j--;
            if (i <= j) {
                const temp = array[i];
                const temp2 = array[j];
                if (temp && temp2) {
                    array[i] = temp2;
                    array[j] = temp;
                } else {
                    throw new Error(`Cannot swap; temp and/or temp2 are not defined.`);
                }
                i++;
                j--;
            }
        } while (i <= j);

        if (low < j) {
            part(low, j);
        }
        if (i < high) {
            part(i, high);
        }
    };

    part(0, array.length - 1);

    return array;
}
