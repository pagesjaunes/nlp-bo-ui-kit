import IWord from "../interfaces/IWord";

/*
* Crée une structure de données IWord à partir d'une string donnée
* Deux variables optionnelles qui vont ensembles :
* la chaine d'entrée peut être une sous-chaîne ("Saint Paul")
* il faut donc la chaîne d'origine ("médecin à Saint Paul")
* ainsi que l'index de départ de la sous-chaîne dans la chaîne originale
*
*    * parsing de l'utérance selon les caractères alphanumériques accentués (groupés), les espaces et les
   * caractères spéciaux (un par un)
   *
   * Les espaces ne sont pas comptés dans la structure de données
   *
   * /!\ Attention, les paramètres optionnels de ILabelled from et to ne sont pas utilisés
   *
   * Prend en compte une pré-labellisation potentielle
   * S'il y a pré-labellisation, on la parcourt pour récupérer toutes les entités
   * On applique pour chaque entité la réconciliation (mots enlevés, accentuation, casse...)
   * puis on ajoute tous les mots pré-labellisés dans un tableau


*/

function createWordList(str: string, start?: number, original?: string) {
    const stringArray = str.match(/([\wÀ-ÖØ-öø-ÿ]+|\s+|.)/g);
    const wordArray: IWord[] = [];
    const full: string = original || str;

    if (!stringArray) {
        return [];
    }

    for (let i = 0, pos = start || 0; i < stringArray.length; i++) {
        if (!stringArray[i].match(/^\s+$/)) {
            const idx = full.indexOf(stringArray[i], pos);
            pos = idx + stringArray[i].length;
            wordArray.push({
                from: idx,
                iob: "O",
                label: "",
                to: idx + stringArray[i].length - 1,
                value: stringArray[i]
            });
        }
    }
    return wordArray;
}

export default createWordList;
