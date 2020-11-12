import {
    CLEAR_SEARCH,
    SET_SEARCH_QUERY,
    SEARCH,
    ISetSearchQueryAction, ISearchAction, IClearSearchAction, SearchActionPayloadType
} from "./types";

const qs = require('qs');

export const setSearchQuery = (payload: string): ISetSearchQueryAction => {
    return  {
        type: SET_SEARCH_QUERY,
        payload
    }
};

export const search = (payload: SearchActionPayloadType): ISearchAction => {
    return {
        type: SEARCH,
        payload
    }
};
export const clearSearch = (): IClearSearchAction => {
    return {
        type: CLEAR_SEARCH
    }
};
