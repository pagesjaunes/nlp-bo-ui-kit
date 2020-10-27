import * as React from "react";
import ILabel from "../interfaces/ILabel";
import IPrelabelled from "../interfaces/IPrelabelled";
import IResponse from "../interfaces/IResponse";
import IWord from "../interfaces/IWord";
import createResultObj from "../utils/createResultObj";
import createWordList from "../utils/createWordList";
import Popin from "./Popin";
import ResultView from './ResultView';
import WordList from './WordList';
import mapEntitiesToIob from "../utils/mapEntitiesToIob";

const labelList: ILabel[] = [
  {
    id: "quiquoi",
    label: "quiquoi",
    samples: [
      "un professionnel (exemple : sfr, macdo)",
      "un metier (exemple : medecin, restaurant)",
    ]
  },
  {
    id: "ou",
    label: "ou",
    samples: ["une localisation (exemple : rennes, boulevard Albert 1er)"]
  },
  {
    id: "qualite",
    label: "qualité (bon, meilleur)",
    samples: ["description d'un qui/quoi (pas cher, le meilleur, promo, avec des tarifs)"]
  },
  {
    id: "prix",
    label: "prix (pas cher)",
    samples: []
  },
  {
    id: "date",
    label: "date (heure, jour)",
    samples: ["information liée à la date/heure de la recherche (exemple : demain, ce soir, à 20h, dimanche)"]
  },
  {
    id: "telephone",
    label: "téléphone (0123456789)",
    samples: ["un numéro de téléphone"]
  },
  {
    id: "pro_ou",
    label: "pro_ou (dans le centre carrefour, proche de macdonald)",
    samples: ["une localisation liée à un professionnel (à coté de darty)"]
  },
  {
    id: "utilisateur_ou",
    label: "utilisateur_ou (mon domicile, mon travail)",
    samples: ["une localisation liée à l'utilisateur (prêt de mon domicile, mon travail, mon medecin)"]
  },
  {
    id: "autres",
    label: "autres",
    samples: []
  },
];
const colorArray = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

interface ILabelliserProps {
  colorList: string[]; // liste des couleurs
  labelList: ILabel[]; // liste des labels
  sentence: string; // phrase à labelliser
  prelabelled: IPrelabelled[] | IWord[]; // tableau de pré-labellisation, qui peut soit être un tableau de IPrelabelled (format externe sans IOB) soit un tableau de IWord (structure interne, avec IOB)
  readonly: boolean; // activation du mode readonly: toutes les fonctionnalités de modification sont annulées
  copyToClipBoard: boolean;
  wordListCallback(wordList: IResponse): void; // callback pour que le composant parent accède aux données de labellisation
}

interface ILabelliserState {
  hasResult: boolean; // indique si on affiche ou non la liste des entités labellisées (s'il y en a)
  isPopinOpen: boolean; // indique si on affiche ou non la modal de selection des labels (si elle est active)
  selectedIds: number[]; // contient les id des mots selectionnés pour l'entité en cours de labellisation
  wordList: IWord[]; // structure de données contenant le résultat de la labellisation de la phrase
}

const hasResult = (prelabelled:  IPrelabelled[] | IWord[]): boolean => {
  return prelabelled && prelabelled.length > 0 && (!!(prelabelled[0] as IPrelabelled).entity
      || (!!(prelabelled[0] as IWord).value && (prelabelled as IWord[]).find(e => e.iob !== 'O') !== undefined))
};

class Labelliser extends React.Component<ILabelliserProps, ILabelliserState> {
  static defaultProps = {
    colorList: colorArray,
    labelList: labelList,
    readonly: false,
    copyToClipBoard: true
  };
  constructor(props: ILabelliserProps) {
    super(props);

    /*
     * Initialisation de l'état du composant à sa construction
     * s'il y a une prélabellisation passée en propriété le résultat doit être affiché (hasResult: true)
     * on initialise la structure de données avec la phrase d'entrée et la prélabellisation
     */
    this.state = {
      hasResult: hasResult(this.props.prelabelled),
      isPopinOpen: false,
      selectedIds: [],
      wordList: this.initializeWordList()
    };

    // liaison des méthodes à l'objet courant
    this.togglePopinOnWordClick = this.togglePopinOnWordClick.bind(this);
    this.selectLabelOnClick = this.selectLabelOnClick.bind(this);
    this.deleteLabelOnClick = this.deleteLabelOnClick.bind(this);
    this.closePopin = this.closePopin.bind(this);
    this.copySentenceOnClick = this.copySentenceOnClick.bind(this);
  }

  /*
   * Envoie au parent le résultat de la labellisation de la phrase au montage du composant
   */
  public componentDidMount(): void {
    this.props.wordListCallback({
      hasIob: this.state.wordList,
      noIob: createResultObj(this.props.sentence, this.state.wordList)
    });
  }

  /*
   * Si la phrase passée n'est plus la même, on réinitialise tout le composant
   * Si la prelabellisation n'est plus la même on réinitialise tout le composant
   * Si la structure de données interne (state.wordlist) a changé, on notifie le composant parent
   */
  public componentDidUpdate(prevProps: Readonly<ILabelliserProps>, prevState: Readonly<ILabelliserState>, snapshot?: any): void {
    if (prevProps.sentence !== this.props.sentence) {
      this.setState({
        hasResult: hasResult(this.props.prelabelled),
        isPopinOpen: false,
        selectedIds: [],
        wordList: this.initializeWordList()
      });
    }

    if (JSON.stringify(prevProps.prelabelled) !== JSON.stringify(this.props.prelabelled)) {
      this.setState({
        hasResult: hasResult(this.props.prelabelled),
        isPopinOpen: false,
        selectedIds: [],
        wordList: this.initializeWordList()
      });
    }

    if (JSON.stringify(prevState.wordList) !== JSON.stringify(this.state.wordList)) {
      this.props.wordListCallback({
        hasIob: this.state.wordList,
        noIob: createResultObj(this.props.sentence, this.state.wordList)
      });
    }
  }

  /* render la liste d'éléments de l'utérance, sélectionnables
   *  render la modal pour attribuer un label à une entité, si on est pas en readonly
   *  render la liste des entités labellisées
   */
  public render() {
    return (
        <div className="labelliser">
          <WordList
              colorList={this.props.colorList}
              wordArray={this.state.wordList}
              labelArray={this.props.labelList.map(elem => elem.id)}
              selectedIds={this.state.selectedIds}
              readonly={this.props.readonly}
              togglePopinOnWordClick={this.togglePopinOnWordClick}
          />
          {
            this.props.copyToClipBoard &&
            <span
                title="Copier la phrase dans le presse-papier"
                onClick={this.copySentenceOnClick}
                className="fa fa-clipboard btn-clipboard"
            />
          }

          {!this.props.readonly && this.state.isPopinOpen && (
              <Popin
                  colorList={this.props.colorList}
                  selectedIds={this.state.selectedIds}
                  labelList={this.props.labelList}
                  selectLabelOnClick={this.selectLabelOnClick}
                  closePopin={this.closePopin}
                  deleteLabelOnClick={this.deleteLabelOnClick}
              />
          )}

          {!this.props.readonly && (
              <ResultView
                  sentence={this.props.sentence}
                  colorList={this.props.colorList}
                  readonly={this.props.readonly}
                  wordArray={this.state.wordList}
                  labelList={this.props.labelList}
                  deleteLabelOnClick={this.deleteLabelOnClick}
              />
          )}
        </div>
    );
  }

  /*
   * initialisation de la structure de données interne (state.wordlist)
   * On récupère la phrase d'origine et la pré-labellisation
   * Si la pré-labellisation est de type IWord[], pas de traitement à faire dessus, on la conserve telle qu'elle
   *
   * Si elle est de type IPrelabelled [], il faut la transformer en IWord[] pour la traiter
   * Pour cela, on itère sur tous les entités de la pré-labellisation, et pour chacune on appelle la réconciliation
   * entre la phrase d'origine et l'entité
   * Ensuite on crée une structure IWord à partir de l'entité
   * (Les entités contenues dans IPrelabelled[] peuvent être des groupes de mots, d'où la nécessité d'avoir la réconciliation et un parsing)
   *
   * On crée le modèle de données interne (state.wordlist) à partir de la phrase originale sans pré-labellisation
   * on remplace dans ce modèle de données celles déjà initialisées dans le tableau de pré-labellisation
   */
  private initializeWordList() {
    let resultArray: IWord[] = [];

    if (this.props.prelabelled && this.props.prelabelled.length > 0) {
      if ((this.props.prelabelled[0] as IPrelabelled).entity) {
        resultArray = mapEntitiesToIob(this.props.sentence, this.props.prelabelled as IPrelabelled[]);
      } else if ((this.props.prelabelled[0] as IWord).value) {
        resultArray = this.props.prelabelled as IWord[];
      }
    }

    return createWordList(this.props.sentence).map((word) => {
      const prelabelled = resultArray.find((res) =>
          (res.value === word.value && res.from === word.from && res.to === word.to)
      );
      if (prelabelled) {
        word.label = prelabelled.label;
        word.iob = prelabelled.iob;
      }

      return word;
    });
  }

  /*
   * Gestion de la sélection d'un élément pour l'ajouter ou l'enlever de la sélection actuelle d'une entité
   * Si on ajoute un élément, on ajoute aussi tous ceux entre le nouvel élément et ceux déjà sélectionnés
   * Si on le supprime, soit on supprime toute la sélection si l'élément est au milieu,
   * soit on supprime juste l'élément de la sélection s'il est à une extrémité
   *
   * Au clic sur un élément, si c'est pour l'ajouter à la sélection et qu'elle est vide, on ouvre la popin
   * Si on enlève le dernier élément de la sélection, on ferme la popin
   *
   * Ne fait rien si on est en readonly puisque les mots sont toujours cliquables même sans le style
   */
  private togglePopinOnWordClick(selectedId: number) {
    if (!this.props.readonly) {
      // Ajout d'éléments à la sélection
      if (
          this.state.selectedIds.find(elem => elem === selectedId) === undefined
      ) {
        const newSelectedIds: number[] = [
          ...this.state.selectedIds,
          selectedId
        ];

        /*
         * On trie les id des mots sélectionnés par ordre croissant
         * on prend le premier id de la liste et on itère jusqu'au dernier
         * A chaque itération, si l'id n'existe pas dans la liste on n'ajoute
         *
         * Comme ça on ajoute à la sélection tous les éléments entre le nouveau et eux déjà présents
         * exemple: Je cherche un restaurant chinois à volonté à Paris
         * si 'restaurant' est déjà sélectionné et qu'on clique sur 'volonté', ça sélectionne aussi 'chinois à'
        */
        newSelectedIds.sort((a, b) => a - b);

        for (let wordId = newSelectedIds[0]; wordId < newSelectedIds[newSelectedIds.length - 1]; wordId++) {
          if (newSelectedIds.find(elem => elem === wordId) === undefined) {
            newSelectedIds.push(wordId);
            newSelectedIds.sort((a, b) => a - b);
          }
        }

        this.setState(
            {
              selectedIds: newSelectedIds
            },
            () => {
              if (!this.state.isPopinOpen) {
                this.setState({
                  isPopinOpen: true
                });
              }
            }
        );
      }
      // Suppression d'éléments à la sélection
      else {
        const index = this.state.selectedIds.indexOf(selectedId);
        let selectedIds: number[] = [];

        /*
        * Si on dé-selectionne le premier élément de la sélection ou le dernier, cela l'enlève de la liste
        * exemple: Je cherche un restaurant chinois à volonté à Paris
        * Si on a déjà sélectionné 'restaurant chinois à volonté' et qu'on clique sur 'restaurant', la sélection devient 'chinois à volonté'
        * Si on a déjà sélectionné 'restaurant chinois à volonté' et qu'on clique sur 'volonté', la sélection devient 'restaurant chinois à'
        *
        * En revanche, si on clique sur un élément au milieu de la sélection, tout se dé-sélectionne
        * Si on a déjà sélectionné 'restaurant chinois à volonté' et qu'on clique sur 'chiois', la sélection devient vide
        */
        if (index === 0 || index === this.state.selectedIds.length - 1) {
          selectedIds = [...this.state.selectedIds.filter(elem => elem !== selectedId)];
        }

        this.setState({selectedIds}, () => {
          if (this.state.selectedIds.length === 0) {
            this.closePopin();
          }
        });
      }
    }
  }

  /*
   *  Ajout d'un label sur une entité sélectionnée
   *  Détermine au passage l'iob de chaque élément de l'entité ainsi que l'iob des entités suivantes
   *  au cas où on les coupe
   *  On ferme la popin dès qu'un label est sélectionné, et on indique
   *  qu'il y a désormais un résultat à afficher (même si c'était déjà le cas avant)
   */
  private selectLabelOnClick(labelId: number) {
    this.closePopin();
    this.setState(
        {
          hasResult: true,
          wordList: this.state.wordList.map((word, idx) => {
            if (this.state.selectedIds.includes(idx)) {
              return {
                ...word,
                iob: this.state.selectedIds.indexOf(idx) === 0 ? 'B' : 'I',
                label: this.props.labelList[labelId].id
              }
            }
            /*
             * Si l'id du mot en cours correspond à l'id suivant le dernier id de la sélection et que
             * son IOB est I, alors on est en train de couper une entité déjà existante
             * et le mot suivant devient un B
             */
            if (idx === this.state.selectedIds[this.state.selectedIds.length - 1] + 1 && word.iob === 'I') {
              return {
                ...word,
                iob: 'B'
              }
            }
            return word
          })
        });
  }

  /*
   * Suppression de la labellisation d'une entité ou d'une sélection d'éléments
   * Gère au passage l'affichage du résultat de la labellisation
   * (si on a supprimé la dernière entité labellisée, il n'y a plus aucun résultat à afficher)
   */
  private deleteLabelOnClick(wordIndexes: number[]) {
    wordIndexes.sort((a, b) => a - b);

    /*
     * Pour supprimer une labellisation, on vide le label de chaque mot et on passe son IOB en O
     * Les élément à supprimer sont forcément consécutifs donc si l'élément suivant le dernier à supprimer
     * a un IOB en I, on le passe en B car on coupe une entité existante
    */
    this.setState({
      wordList: this.state.wordList.map((word, idx) => {
        if (wordIndexes.includes(idx)) {
          return {
            ...word,
            iob: 'O',
            label: ""
          };
        }
        if (idx === wordIndexes[wordIndexes.length - 1] + 1 && word.iob === 'I') {
          return {
            ...word,
            iob: 'B'
          }
        }
        return word;
      })
    }, () => {
      if (this.state.wordList.find(w => w.iob !== 'O') === undefined) {
        this.setState({hasResult: false});
      }
    });
  }

  /*
   * Fonction pour fermer la popin
   * On dé-sélectionne au passage les mots de la phrase qui étaient sélectionnés
   */
  private closePopin() {
    this.setState({
      isPopinOpen: false,
      selectedIds: []
    });
  }

  /*
   * Fonction pour copier le texte de la phrase dans le presse papier au clic sur un bouton
   * On crée une instance de textArea dans le HTML, on lui passe comme valeur la phrase
   * On sélectionne la phrase puis on lance la commande système pour copier
   * Puis on enlève l'instance de textArea
  */
  private copySentenceOnClick() {
    const toCopy = document.createElement("textarea");
    document.body.appendChild(toCopy);
    toCopy.value = this.props.sentence;
    toCopy.select();
    document.execCommand("copy");
    document.body.removeChild(toCopy);
  }
}

export default Labelliser;
