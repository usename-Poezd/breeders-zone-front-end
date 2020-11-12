import {ICountry} from "../../types";
import {ISetCountriesAction, SET_COUNTRIES} from "./types";

export const setCountries = (payload: Array<ICountry>): ISetCountriesAction => {
    return {
        type: SET_COUNTRIES,
        payload
    }
};
