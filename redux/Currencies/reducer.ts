import {CurrenciesActionsType, ICurrenciesState, SET_CURRENCIES} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const initialState: ICurrenciesState = {
   all: []
};

const currenciesReducer = (state = initialState, action: CurrenciesActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, payload.currencies);
            return {
                ...state,
                ...payload.currencies,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.currencies.all,
            };
        case SET_CURRENCIES:
            return {
                ...state,
                all: payload
            };
        default:
            return state
    }
};

export {
    currenciesReducer
};
