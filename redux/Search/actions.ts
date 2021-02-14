import {
    CLEAR_SEARCH,
    SET_SEARCH_QUERY,
    SEARCH,
    ISetSearchQueryAction, ISearchAction, IClearSearchAction, SearchActionPayloadType
} from "./types";
export const setSearchQuery = (payload: string): ISetSearchQueryAction => {
    return  {
        type: SET_SEARCH_QUERY,
        payload
    }
};

export const search = (payload: SearchActionPayloadType = {
    kind: 'any',
    subcategory: 'any',
    locality: 'any',
    sex: 'any',
    age: 'any',
    price_max: '1000000',
    price_min: '0',
    morphs_max: '9',
    morphs_min: '0',
    morphs_in: [],
    morphs_out: []
}): ISearchAction => {
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
