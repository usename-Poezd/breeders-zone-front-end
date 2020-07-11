import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.kinds;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.kinds);
            return {
                ...state,
                ...action.payload.kinds,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.kinds.all,
                active: stateDiff?.active?.['_0']?.[0] && stateDiff?.active?.['_0']?.[0] === state.active?.[0] ? state.active : action.payload.kinds.active,
            };
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
