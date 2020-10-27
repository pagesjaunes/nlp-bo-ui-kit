import * as React from "react";
import ClickOutComponent from "react-clickout-handler";
import ILabel from "../interfaces/ILabel";

interface IPopinProps {
    colorList: string[], // liste des couleurs
    labelList: ILabel[], // liste des labels
    selectedIds: number[], // liste des ids des mots sélectionnés
    selectLabelOnClick(labelId: number): void, // méthode pour ajouter un label à une entité au clic dessus
    closePopin(): void, // méthode pour fermer la popin
    deleteLabelOnClick(indexes: number[]): void // méthode pour supprimer le label de toute la sélection au clic
}

interface IPopinState {
    filter: string, // valeur du filtre pour trier la liste des labels selon la recherche
    left: number, // position horizontale de la popin
    sortedLabelList: string[], // liste des labels triée selon le filtre
    top: number, // position verticale de la popin
}

/*
 * petite fenêtre incluse dans la fenêtre principale, qui ne la remplace pas ni ne l'écrase, mais s'affiche par dessus
 * Affiche la liste des labels
 */
class Popin extends React.Component<IPopinProps, IPopinState> {
    constructor(props: IPopinProps) {
        super(props);

        /*
         * Initialisation de l'état du composant à sa construction
         * Le filtre est initialement vide, de même que les positions verticale et horizontale de la popin sont à 0
         * La liste des labels triés est initialisée avec la liste des id de tous les labels
         */
        this.state = {
            filter: "",
            left: 0,
            sortedLabelList: this.props.labelList.map(elem => elem.id),
            top: 0,
        };

        // liaison des méthodes à l'objet courant
        this.handleOnClickOutsidePopin = this.handleOnClickOutsidePopin.bind(this);
        this.handleOnSearchChange = this.handleOnSearchChange.bind(this);
        this.deleteLabelOfSelection = this.deleteLabelOfSelection.bind(this);
    }

    /*
    * On définit la position de la popin après le montage du composant
    */
    public componentDidMount(): void {
        this.definePopinTopAndLeft();
    }

    /*
    * On re-définit la position de la popin quand les éléments sélectionnés changent
    */
    public componentDidUpdate(prevProps: Readonly<IPopinProps>, prevState: Readonly<IPopinState>, snapshot?: any): void {
        if (this.props.selectedIds.length !== prevProps.selectedIds.length) {
            this.definePopinTopAndLeft();
        }
    }

    /*
    * render la popin avec une croix pour la fermer,
    * un champ de saisie de texte pour rechercher un label,
    * une poubelle pour supprimer les labels de toute la sélection en cours,
    * et la liste des labels triée selon la recherche
    *
    * La taille de la popin est fixe avec une barre de scroll s'il y a trop de labels à afficher
     */
    public render() {
        const labelArray = this.props.labelList.map(elem => elem.id);

        return (
            <ClickOutComponent onClickOut={this.handleOnClickOutsidePopin}>
                <div className="popin" id="popin" style={{ left: this.state.left, top: this.state.top }}>
                    <span title="Ferme la popin" onClick={this.props.closePopin} className="popin-close">&times;</span>
                    <input className="popin-search" type="text" value={this.state.filter} placeholder="Rechercher un label" onChange={this.handleOnSearchChange}/>
                    <span title="Supprime les labels de la sélection actuelle" onClick={this.deleteLabelOfSelection} className="fa fa-trash popin-delete"/>
                    <div className="popin-content">
                        {this.state.sortedLabelList.map((elem) =>
                            /* tslint:disable-next-line:jsx-no-lambda */
                            (<p onClick={() => {this.props.selectLabelOnClick(labelArray.indexOf(elem))}}
                                className="popin-label"
                                key={labelArray.indexOf(elem)}
                                style={{backgroundColor: this.props.colorList[labelArray.indexOf(elem)  % this.props.colorList.length]}}
                                title={this.props.labelList[labelArray.indexOf(elem)].samples.join("\n")}
                            >
                                {this.props.labelList[labelArray.indexOf(elem)].label}
                            </p>))}
                    </div>
                </div>
            </ClickOutComponent>
        );
    }

    /*
    * Gestion du clic en dehors de la popin lorsqu'elle est affichée
    * On ferme la modal lorsqu'un clic a lieu en dehors de la modal, sauf si c'est sur un élément de l'utérance
    */
    private handleOnClickOutsidePopin(event: React.MouseEvent): void {
        if ((event.target as HTMLSpanElement).className.search("word ") === -1) {
            this.props.closePopin();
        }
    }

    /*
    * calcule la position de la popin par rapport à la hauteur de la phrase en entier pour la verticale
    *  et par rapport à la taille de l'entité sélectionnée pour l'horizontale (càd la taille de tous les éléments sélectionnés dans la phrase)
    */
    private definePopinTopAndLeft() {
        const wordList = document.getElementById('wordlist');
        const words = document.getElementsByClassName("word");
        const popin = document.getElementById("popin");
        let top = 0;
        let left = 0;
        let wid = 0;

        if (wordList) {
            top = wordList.getBoundingClientRect().height;
        }

        if (words.length > 0) {
            this.props.selectedIds.forEach((item, index) => {
                const node: Element | undefined = Array.from(words).find((element) => element.id === item.toString());
                if (node) {
                    if (index === 0) {
                        left = (node as HTMLElement).offsetLeft;
                    }
                    wid += node.getBoundingClientRect().width;
                }
            });
        }

        left += wid / 2;
        if (popin) {
            left -= popin.getBoundingClientRect().width / 2;
        }

        this.setState({
            left,
            top,
        });
    }

    /*
    * Trie la liste de labels selon la recherche effectuée
     */
    private handleOnSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            filter: event.target.value,
            sortedLabelList: this.props.labelList.map(elem => elem.id).filter((value) => value.indexOf(event.target.value) !== -1)
        });
    }

    /*
    * Supprime les labels des éléments selectionnés, s'ils en ont, peu importe la sélection, et ferme la popin
     */
    private deleteLabelOfSelection() {
        this.props.deleteLabelOnClick(this.props.selectedIds);
        this.props.closePopin();
    }
}

export default Popin;
