import * as React from "react";
import IWord from "../interfaces/IWord";

interface IWordListProps {
    colorList: string[], // liste des couleurs
    wordArray: IWord[], // structure de données contenant le résultat de la labellisation de la phrase
    labelArray: string[], // liste des id des labels
    selectedIds: number[], // liste des ids des mots sélectionnés
    readonly: boolean,// activation du mode readonly: toutes les fonctionnalités de modification sont annulées
    togglePopinOnWordClick(index: number): void, // méthode pour gérer la sélection d'un élément au clic dessus
}

/*
* Mappe pour chaque élément de la phrase un composant de présentation cliquable
* L'élément reste cliquable même en readonly mais sans aucun effet de style et la fonction au click ne fait rien du tout
*
* les effets de style sont enlevés avec la classe css readonly, plus d'effet au hover et un curseur de texte et non pas de pointeur
 */
const WordList: React.FunctionComponent<IWordListProps> = ({ colorList, wordArray, labelArray, selectedIds, readonly, togglePopinOnWordClick }) => (
    <div className="wordlist" id="wordlist">
        {wordArray.map((elem, index) =>
                    // tslint:disable-next-line:jsx-no-lambda
                    <span onClick={() => {togglePopinOnWordClick(index)}}
                          id={index.toString()}
                          key={index}
                          className={(elem.iob === 'O' ? "word alone" : elem.iob === 'B' ? "word begin" : "word linked") + (readonly ? " readonly" : "")}
                          style={{
                              backgroundColor: elem.label === "" ? "transparent" : colorList[labelArray.indexOf(elem.label) % colorList.length],
                              color: selectedIds.find(e => e === index) !== undefined ? "red" : "black",
                              textDecoration: selectedIds.find(e => e === index) !== undefined ? "underline" : "none"
                          }}>
                    {elem.value}
                </span>
            )
        }
    </div>
);

export default WordList;
