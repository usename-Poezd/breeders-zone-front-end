import {HYDRATE} from "next-redux-wrapper";
import {KindsActionsType, IKindsState, SET_KINDS} from "./types";

const initialState: IKindsState = {
    all: [],
    active: [],
    activeKind: null
};

export const kindsReducer = (state = initialState, action: KindsActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...action.payload.kinds,
            };
        case SET_KINDS:
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
