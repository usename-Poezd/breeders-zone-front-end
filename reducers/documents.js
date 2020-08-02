import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";

const documents = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.documents;
    }

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...payload.documents,
            };
        case 'SET_AGREE_DOCUMENTS':
            return {
                ...state,
                agree: payload
            };
        default:
            return state;
    }
};

export default documents;
