import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.kinds;
    }

    switch (action.type) {
        case HYDRATE:
            return {...state, ...action.payload.kinds};
        case 'SET_KINDS':
            return {
                ...state,
                all: payload.kinds,
                active: payload.activeKinds
            };
        case 'SET_ACTIVE_KIND':
            return {
                ...state,
                activeKind:  payload
            };
        default:
            return state;
    }
};

export default kinds;
