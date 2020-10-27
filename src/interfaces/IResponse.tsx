import IPrelabelled from "./IPrelabelled";
import IWord from "./IWord";

interface IResponse {
    hasIob: IWord[],
    noIob: IPrelabelled[]
}

export default IResponse;
