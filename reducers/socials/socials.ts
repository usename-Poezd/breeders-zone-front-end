import {ISocialState} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {AnyAction} from "redux";

const initialState: ISocialState = {
   all: []
};

const socials = (state = initialState, action: AnyAction) => {
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
        case "SET_SOCIALS":
            return {
                ...state,
                all: payload
            };
        default:
            return state
    }
};

export default socials;
