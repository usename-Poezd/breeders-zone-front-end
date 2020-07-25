import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const countries = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.countries;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.countries);
            return {
                ...state,
                ...payload.countries,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.countries.all,
            };
        case 'SET_COUNTRIES':
            return {
                ...state,
                all: payload
            };
        default:
            return state;
    }
};

export default countries;
