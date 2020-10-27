import IPrelabelled from "../interfaces/IPrelabelled";
import IWord from "../interfaces/IWord";
import reconciliateStrings from "./reconciliation";
import createWordList from "./createWordList";

function mapEntitiesToIob(sentence: string, prelabelled: IPrelabelled[]) {

    let resultArray: IWord[] = [];
    prelabelled.forEach((elem) => {
        const reconciliation = reconciliateStrings(sentence, elem.entity, elem.from, elem.to);

        resultArray = [
            ...resultArray,
            ...createWordList(reconciliation.result, reconciliation.from, sentence)
                .map((word, idx) => ({
                    ...word,
                    iob: idx === 0 ? "B" : "I",
                    label: elem.label,
                }))
        ]
    });

    return resultArray;
}

export default mapEntitiesToIob;
