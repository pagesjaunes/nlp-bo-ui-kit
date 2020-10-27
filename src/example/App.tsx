import * as React from 'react';
import './App.css';
import Labelliser from "../components/Labelliser";
import IPrelabelled from "../interfaces/IPrelabelled";
import IResponse from "../interfaces/IResponse";
import IWord from "../interfaces/IWord";
import Response from './Response';

const sentences: string[] = [
    "Je cherche un médecin à Montélimar ouvert en fin d'après-midi",
    "Prendre rdv chez un coiffeur au centre de Rennes un samedi matin",
    "ostéopathe à Rennes ostéopathe ouvert le midi"
];
const preLabellisation: IPrelabelled[][] = [
    [
        {
            entity: "medecin",
            label: "quiquoi",
        },
        {
            entity: "montelimar",
            label: "ou"
        },
        {
            entity: "fin d apres midi",
            label: "date"
        },
    ],
    [],
    [
        {
            entity: "ostéopathe",
            from: 20,
            label: "quiquoi",
            to: 29
        }
    ]
];

interface ILabelledSentence {
    id: number,
    sentence: string,
    wordlist: IWord[]
}

interface IAppState {
  list: ILabelledSentence[]
}

class App extends React.Component<{}, IAppState> {
    constructor(props: any) {
        super(props);
        this.wordListCallback = this.wordListCallback.bind(this);
        this.state = {
            list: sentences.map((s, i) => ({ id: i, sentence: s, wordlist: [] }))
        };
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src="/logo.svg" className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                {
                    this.state.list.map((elem) => (
                        <div key={elem.id}>
                            <Labelliser
                                sentence={elem.sentence}
                                prelabelled={preLabellisation[elem.id]}
                                wordListCallback={this.wordListCallback}
                                readonly={elem.id === 0}
                            />
                            <Response wordList={elem.wordlist} />
                        </div>
                    ))
                }
            </div>
        );
    }

    private wordListCallback(wordlist: IResponse) {
        const item = this.state.list.find((elem) => elem.sentence.startsWith(wordlist.hasIob[0].value));
        if (item) {
            const { list } = this.state;

            list[item.id].wordlist = wordlist.hasIob;

            this.setState({
                list
            });
        }
      }
}

export default App;
