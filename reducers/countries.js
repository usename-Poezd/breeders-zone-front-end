import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";

const countries = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.countries;
    }

    switch (action.type) {
        case HYDRATE:
            return {...state, ...payload.countries};
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
