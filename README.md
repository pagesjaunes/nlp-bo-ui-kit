# nlp-bo-ui-kit

nlp-bo-ui-kit is a React Typescript component for labellisation of natural language processing.

![](/src/example/example-edit.png)

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

You need to pass the `sentence` as a string that needs to be labelled.

In `prelabelled` you can fill in a list describing an external labellisation that has to be taken into account at the start of the component.

You can use `wordlistCallback` which acts like an event handler and fires each time a modification is done in the labelling, to get the result in the parent component and do whatever treatment you need with it.

There are also 4 optional properties :

- `labelList` is the list of labels that can be attributed to an expression for the labelling
- `colorList`is the list of names or hexadecimal codes for the colors that will be associated to each label
- `readonly` determines wether the component can be used to edit the labelling of a sentence or just to display it, set by default to false
- `copyToClipBoard` shows a button to copy the sentence to the clipboard, set by default to true

## Functionalities

### Component functionalities :
- In edit mode, each word is clickable. You can select one word by clicking on it.
If you click on 2 different words, it will select them and all the words in between.
You can also unselect words by clicking outside of the component, or by clicking on an already selected word
(if you unselect the first or last word, it only unselect it, but if you select a word in between them, it will unselect all the words).
- After selecting an expression, a pop-in is displayed, which allows you to see the list of available labels.
Click on one label to attribute it to the selection. You also have an input the search for a label by name.

![](/src/example/example-edit.png)

- Each expression already associated to a label is highlighted in the same color as the label that is in the pop-in.
- Under the sentence, there is a summary of the expressions with a label. For each of them, you can choose to delete the attributed label.

![](/src/example/example-labelled.png)

- In readonly mode, only the prelabelling passed as a property is displayed through the highlights on the sentence.
 The summary usually below is hidden and all interactions are disabled.

![](/src/example/example-readonly.png)

### Reconciliation :

There is a system of reconciliation in the code when describing a prelabelling.

It means that if the expression passed isn't exactly matching the sentence (for example: case-sensitive, special chars, typing errors, spaces or dashes bad fit)
or if the indexes are indicated but slightly shifted, a fuzzy-search of the expression in the sentence occurs to rematch it and obtain accurate data for the labelling.
 
*(Ex: if the sentence is **"Médecin à Saint-Martin"** and the prelabelling specifies a label "ou" on the expression **"saintmartin"** 
 the reconciliation will match the part of the sentence **"Saint-Martin"** as the accurate data.)*
 
 There is a set of Jest tests written for this part of the code. They are located in the subfolder `tests/` and can 
 be run with the command `npm run test` or `yarn start`.

## Example

The `index.tsx` and `example/` folder contain an example project.

![](/src/example/example-full.png)

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
