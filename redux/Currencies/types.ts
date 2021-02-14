import {AnyAction} from "redux";

const SET_CURRENCIES = 'SET_CURRENCIES';

export interface ICurrenciesState {
    all: Array<string>
}

export interface ISetCurrenciesAction {
    type: typeof SET_CURRENCIES,
    payload: Array<String>
}

export type CurrenciesActionsType = ISetCurrenciesAction | AnyAction;
export {
    SET_CURRENCIES
}
