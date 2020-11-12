import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {CountriesActionsType, ICountriesState, SET_COUNTRIES} from "./types";

const initialState: ICountriesState = {
    all: []
};

const countriesReducer = (state = initialState, action: CountriesActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.countries);
            return {
                ...state,
                ...payload.countries,
                all: stateDiff?.all?.['_0']?.[0] && stateDiff?.all?.['_0']?.[0] === state.all?.[0] ? state.all : action.payload.countries.all,
            };
        case SET_COUNTRIES:
            return {
                ...state,
                all: payload
            };
        default:
            return state;
    }
};

export default countriesReducer;
