import {ICurrenciesState} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {AnyAction} from "redux";

const initialState: ICurrenciesState = {
   all: []
};

const currencies = (state = initialState, action: AnyAction) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, payload.currencies);
            return {
                ...state,
                ...payload.currencies,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.currencies.all,
            };
        case "SET_CURRENCIES":
            return {
                ...state,
                all: payload
            };
        default:
            return state
    }
};

export default currencies;
