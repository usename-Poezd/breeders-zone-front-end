import {IDocument} from "../../types";
import {ISetAgreeDocumentsAction, SET_AGREE_DOCUMENTS} from "./types";

export const setAgreeDocuments = (payload: Array<IDocument>): ISetAgreeDocumentsAction => {
    return {
        type: SET_AGREE_DOCUMENTS,
        payload
    }
};
