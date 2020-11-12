import {ICountry} from "../../types";
import {AnyAction} from "redux";

const SET_COUNTRIES = 'SET_COUNTRIES';

export interface ISetCountriesAction {
    type: typeof SET_COUNTRIES
    payload: Array<ICountry>
}

export interface ICountriesState {
    all: Array<ICountry>
}

export type CountriesActionsType = ISetCountriesAction | AnyAction;

export {
    SET_COUNTRIES
}
