import {IDocument} from "../../types";
import {AnyAction} from "redux";

const SET_AGREE_DOCUMENTS = 'SET_AGREE_DOCUMENTS';

export interface ISetAgreeDocumentsAction {
    type: typeof SET_AGREE_DOCUMENTS
    payload: Array<IDocument>
}

export interface IDocumentsState {
    agree: Array<IDocument>
}

export type DocumentsActionsType = ISetAgreeDocumentsAction | AnyAction;

export {
    SET_AGREE_DOCUMENTS
}
