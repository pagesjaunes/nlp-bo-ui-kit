import * as React from "react";
import ILabel from "../interfaces/ILabel";
import IWord from "../interfaces/IWord";
import createResultObj from "../utils/createResultObj";

interface IResultViewProps {
    sentence: string, // phrase à labelliser
    colorList: string[], // liste des couleurs
    labelList: ILabel[], // liste des labels
    wordArray: IWord[], // structure de données contenant le résultat de la labellisation de la phrase
    readonly: boolean, // activation du mode readonly: toutes les fonctionnalités de modification sont annulées
    deleteLabelOnClick(indexes: number[]): void // méthode pour supprimer le label d'une entité
}

/*
* Renvoie une table HTML contenant les entités, leur label et un bouton pour supprimer la labellisation d'une entité
* Concatène les éléments consécutifs qui ont B ou I en iob pour afficher les entités en entier
* Ne liste pas les éléments qui ont O en iob
 */
const ResultView: React.FunctionComponent<IResultViewProps> = ({ sentence, colorList, wordArray, labelList, readonly, deleteLabelOnClick }) => {

    const resultObj = createResultObj(sentence, wordArray);
    const resultList: React.ReactNode[] = [];
    const labelArray = labelList.map(elem => elem.id);

    resultObj.forEach((elem) => {
        const indexList: number[] = [];
        const start = wordArray.findIndex((e) => e.from === elem.from);
        const end = wordArray.findIndex((e) => e.to === elem.to);
        for (let i = start; i <= end; i++) {
            indexList.push(i);
        }

        /*
         * le bouton supprimer est enlevé en readonly
         * on donne à la balise <tr> un id qui correspond à celui du premier mot de l'entité correspondante
        */
        resultList.push(
            <tr key={indexList[0].toString()} id={indexList[0].toString()}>
                <td className="result-text">{elem.entity}</td>
                <td className="result-text">
                        <span className="result-label"
                              style={{backgroundColor: colorList[labelArray.indexOf(elem.label) % colorList.length]}}>
                            {labelList[labelArray.indexOf(elem.label)].label}
                        </span>
                </td>
                {
                    !readonly &&
                    /* tslint:disable-next-line:jsx-no-lambda */
                    <td className="fa fa-trash result-delete" title="Supprime la labellisation de l'entité" onClick={() => deleteLabelOnClick(indexList)}/>
                }
            </tr>
        );
    });

    // on trie la liste des résultats selon la propriété HTML id la plus basse pour que les résultats soient dans l'ordre de la phrase
    const props = "props";
    const propname = "id";
    resultList.sort((a, b) => {
        return Number.parseInt((a as object)[props][propname], 10) -
            Number.parseInt((b as object)[props][propname], 10);
    });
        return (
            resultList.length ?
                <table className="result">
                    <thead>
                    <tr>
                        <th className="result-text">Entité</th>
                        <th className="result-text">Label</th>
                        {
                            !readonly &&
                            <th className="result-delete"/>
                        }
                    </tr>
                    </thead>
                    <tbody>
                        {resultList}
                    </tbody>
                </table>
                :
                <div>
                    <p className="hint-resultView">Cliquez sur les mots pour commencer à labelliser.</p>
                </div>
        );
 };

export default ResultView;
