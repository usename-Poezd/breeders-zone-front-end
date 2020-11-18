import {IMorph} from "../../types";

const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';

const SEARCH = 'SEARCH';
const CLEAR_SEARCH = 'CLEAR_SEARCH';

export type SearchActionPayloadType = {
    kind: string
    subcategory: string|null
    locality: string|null
    sex: string
    age: string
    morphs_min: string
    morphs_max: string
    price_min: string
    price_max: string
    morphs_in: Array<IMorph>
    morphs_out: Array<IMorph>
}

export interface ISearchAction {
    type: typeof SEARCH,
    payload: SearchActionPayloadType
}


export interface ISetSearchQueryAction {
    type: typeof SET_SEARCH_QUERY
    payload: string
}

export interface IClearSearchAction {
    type: typeof CLEAR_SEARCH
    payload?: any
}

export interface ISearchState {
    query: string
}

export type SearchActionsType = ISetSearchQueryAction | IClearSearchAction;

export {
    SET_SEARCH_QUERY,

    CLEAR_SEARCH,
    SEARCH
}
