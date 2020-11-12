import {HYDRATE} from "next-redux-wrapper";
import {DocumentsActionsType, IDocumentsState, SET_AGREE_DOCUMENTS} from "./types";

const initialState: IDocumentsState = {
    agree: []
};

const documentReducer = (state = initialState, action: DocumentsActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...payload.documents,
            };
        case SET_AGREE_DOCUMENTS:
            return {
                ...state,
                agree: payload
            };
        default:
            return state;
    }
};

export {
    documentReducer
};
