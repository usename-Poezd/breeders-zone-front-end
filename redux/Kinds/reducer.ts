import {HYDRATE} from "next-redux-wrapper";
import {KindsActionsType, IKindsState, SET_KINDS} from "./types";
import {diff} from "jsondiffpatch";

const initialState: IKindsState = {
    all: [],
    active: [],
    activeKind: null
};

export const kindsReducer = (state = initialState, action: KindsActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.kinds);
            return {
                ...state,
                ...action.payload.kinds,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.kinds.all,
                active: stateDiff?.active?.['_0']?.[0] && stateDiff?.active?.['_0']?.[0] === state.active?.[0] ? state.active : action.payload.kinds.active,
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
