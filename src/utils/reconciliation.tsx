import * as Fuse from "fuse.js";

interface IStringFuse {
    text: string
}

interface IReconciliation {
    from: number,
    to: number,
    result: string
}

export function normalizeString(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function searchExactSubstring(text: string, search: string , from?: number, to?: number): IReconciliation | undefined {
    if (from && to) {
        if (text.substring(from, to + 1) === search) {
            return {
                from,
                result: text.substring(from, to + 1),
                to
            }
        }
    } else {
        const idx = text.indexOf(search);
        if (idx !== -1) {
            return {
                from: idx,
                result: text.substring(idx, idx + search.length),
                to: idx + search.length - 1
            }
        }
    }

    const normalizedText = normalizeString(text);
    const normalizedSearch = normalizeString(search);

    if (from && to) {
        if (normalizedText.substring(from, to + 1) === normalizedSearch) {
            return {
                from,
                result: text.substring(from, to + 1),
                to,
            };
        }
    }

    const index = normalizedText.indexOf(normalizedSearch);

    if (index !== -1) {
        return {
            from: index,
            result: text.substring(index, index + normalizedSearch.length),
            to: index + normalizedSearch.length - 1
        };
    }
    return undefined;
}

function mapAllPossibilities(array: string[]): IStringFuse[] {
    const list: IStringFuse[] = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            list.push({
                text: array.slice(i, j + 1).join("")
            });
        }
    }

    return list;
}

function getClosingParenthesis(reconciliate: IReconciliation, origin: string): IReconciliation {
    if (reconciliate.result !== "" && reconciliate.result.includes('(')) {
        for (let i = reconciliate.to + 1; i < origin.length ; i++) {
            if (!origin[i].match(/^\s+$/)) {
                if (origin[i] === ')') {
                    reconciliate.to = i;
                    reconciliate.result = origin.substring(reconciliate.from, i + 1);
                } else break;
            }
        }
    }

    return reconciliate;
}

function reconciliateStrings(origin: string, substring: string, from?: number, to?: number): IReconciliation {
    const exactMatch: IReconciliation | undefined = searchExactSubstring(origin, substring, from, to);
    let result: IReconciliation = {
        from: 0,
        result: "",
        to: 0
    };

    if (exactMatch) {
        result = exactMatch;
    }
    let list: IStringFuse[] = [];

    const array = origin.match(/([\wÀ-ÖØ-öø-ÿ]+|\s+|.)/g);
    if (array) {
        list = mapAllPossibilities(array);


        const options: Fuse.FuseOptions<IStringFuse> = {
            distance: 100,
            keys: ["text"],
            location: 0,
            matchAllTokens: true,
            maxPatternLength: substring.length,
            minMatchCharLength: 1,
            shouldSort: true,
            threshold: 0.4,
            tokenize: true,
        };

        const fuse = new Fuse(list, options);
        const fuseResult = fuse.search(substring);
        if (fuseResult && fuseResult.length > 0) {
            const res: IStringFuse = fuseResult[0] as IStringFuse;
            const beg = origin.indexOf(res.text, from ? from : 0);
            result = {
                from: beg,
                result: res.text,
                to: beg + res.text.length - 1
            };
        }

        result = getClosingParenthesis(result, origin);
    }
    return result;
}

export default reconciliateStrings;
