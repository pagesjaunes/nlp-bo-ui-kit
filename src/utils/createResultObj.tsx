import IPrelabelled from "../interfaces/IPrelabelled";
import IWord from "../interfaces/IWord";

function createResultObj(sentence: string, wordList: IWord[]) {
    const obj: IPrelabelled[] = [];
    let start = 0;

    wordList.forEach((elem, index) => {
        if (elem.iob === 'B') {
            start = elem.from;
        }

        // ajout d'une entité à l'objet : on est à la fin d'une entité lorsqu'il n'y a plus de I à suivre
        if ((elem.iob === 'I' || elem.iob === 'B') && (!wordList[index + 1] || wordList[index + 1].iob !== 'I')) {
            obj.push({
                entity: sentence.substring(start, elem.to + 1),
                from: start,
                label: elem.label,
                to: elem.to
            });
        }
    });

    return obj;
}

export default createResultObj;
