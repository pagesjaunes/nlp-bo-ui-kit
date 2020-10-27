# nlp-bo-ui-kit

nlp-bo-ui-kit is a React Typescript component for labellisation of natural language processing.

![](https://cloud.githubusercontent.com/assets/1412392/5339491/c40de124-7ee1-11e4-9f07-9276e2545f27.png)

## Installation

Download the repository. The source code is in the `src/` folder. You will need to import the files from the subfolders `components/`, `interfaces/` and `utils/`.

You will also need to import the index.css located in the `style/` subfolder.

Don't forget to install the inner dependencies by adding them in your `package.json`.

You will need the following packages : react-clickout-handler and fuse.js.

## Usage

The main component of this kit is the Labelliser. Its basic use can be described with :

```typescript jsx
import * as React from "react";
import Labelliser from "./components/Labelliser";

interface State {
    currentLabelling: IResponse
}

const sentenceToLabel: string = "Je cherche une boulangerie";
const preLabelling: IPrelabelled[] = [
    {
        entity: "boulangerie",
        label: "quiquoi"
    }
];

class Example extends React.Component<{}, State> {
    constructor() {
        super();
        this.state = { currentLabelling: new IResponse };
        this.callback = this.callback.bind(this);
    }

    private callback(newLabelling: IResponse) {
        currentLabelling = newLabelling;
    };

    render() {
        return (<Labelliser
                    sentence={sentenceToLabel}
                    prelabelled={preLabelling}
                    wordListCallback={this.callback}
                />);    
    }
}

```

## Configuration

The Labelliser requires 3 mandatory properties, as shown above.

These properties are sentence: string (sentence that needs to be labelled)

prelabelled: IPrelabelled | IWord : a list describing an already existing labellisation that has to be taken into account at the start of the component.

wordlistCallback: a callback called by the component each time a modification is done in it, to get the result in the parent component.

There are also 4 optional properties :

labelList: ILabel[], the list of labels that can be attributed to an expression for the labelling.

colorList: string[], a list of names of hexadecimal codes for the colors that will be associated to each label.

readonly: boolean, default is false, determines wether the component can be used to edit the labelling of a sentence or just to show it.

copyToClipBoard: boolean, default is true, show a button to copy the sentence to the clipboard.

## Functionalities

Module functionalities :
- In edit mode, each word is clickable. You can select one word by clicking on it.
If you click on 2 different words, it will select them and all the words in between.
You can also unselect words by clicking outside of the component, or by clicking on an already selected word.
(if first or last, only unselect it, if in between, unselect all)
- After selecting an expression, a pop-in is displayed, which allows you to see the list of available labels.
Click on one label to attribute it to the selection. You also have an input the search for a label by name.
- Each expression already associated to a label is highlighted in the same color as the label in the pop-in.
- Under the sentence, there is a summary of the expressions with a label. For each, you can choose to delete it.
- In readonly mode, only the prelabelling passed as a property is displayed through the highlights on the sentence.
 The summary below is hidden and all interactions are disabled.

Reconciliation :

There is a system of reconciliation in the code when describing a prelabelling.

It means that if the expression passed isn't exactly matching the sentence 
(aka case-sensitive, special chars, typing errors, spaces/dashes bad fit)
or if the indexes are indicated but slightly shifted, a fuzzy-search of the expression in the sentence occurs
 to rematch it and obtain accurate data for the labelling.
 
*(Ex: if the sentence is **"Médecin à Saint-Martin"** and the prelabelling specifies a label "ou" on the expression **"saintmartin"** 
 the reconciliation will match the part of the sentence **"Saint-Martin"** as the accurate data.)*
 
 There is a set of Jest tests written for this part of the code. They are located in the subfolder `tests/` and can 
 be run with the command `npm run test` or `yarn start`.

## Example

The `index.tsx` and `example/` folder contain an example project.

![](/src/example/example-edit.png)

The scripts for the project can be managed with *npm* or *yarn*.

You will first need to install the dependencies with `npm i` or `yarn install`.


To locally run the example, use `npm run start` or `yarn start`.

It will start the example project on a port of your localhost.

You can obtain a production version of the project with `npm run build` or `yarn build`.

And then serve it locally or on a distant server with `npm run serve` or `yarn serve`.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
Licensed under MIT license, see [LICENSE](LICENSE) for the full license.