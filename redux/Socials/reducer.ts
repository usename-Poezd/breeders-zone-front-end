import {SocialsActionsType, ISocialsState, SET_SOCIALS} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const initialState: ISocialsState = {
   all: []
};

const socialsReducer = (state = initialState, action: SocialsActionsType) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, payload.socials);
            return {
                ...state,
                ...payload.socials,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.socials.all,
            };
        case SET_SOCIALS:
            return {
                ...state,
                all: payload
            };
        default:
            return state
    }
};

export {
    socialsReducer
};
