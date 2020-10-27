import * as React from 'react';
import IWord from "../interfaces/IWord";

interface IResponseProps {
    wordList: IWord[]
}

interface IResponseState {
    showResponse: boolean
}

class Response extends React.Component<IResponseProps, IResponseState> {
    constructor(props: IResponseProps) {
        super(props);
        this.state = {
            showResponse: false
        };
        this.hideResponse = this.hideResponse.bind(this);
    }

    public render() {
        return (
            <div className="response" style={{textAlign:"left", width: "30%", margin: "auto"}}>
                <div>
                    <span style={{textAlign: "center"}}>Response preview</span>
                    <button onClick={this.hideResponse} style={{marginLeft: "20px"}}>{
                        this.state.showResponse ? "Hide" : "Show"
                    }</button>
                </div>
                {
                    this.state.showResponse &&
                    <pre>{JSON.stringify(this.props.wordList, null, 2)}</pre>
                }
            </div>
        );
    }

    private hideResponse() {
        this.setState({
            showResponse: !this.state.showResponse
        });
    }
}

export default Response;
