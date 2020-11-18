import {
    CLEAR_SEARCH,
    SET_SEARCH_QUERY,
    ISearchState, SearchActionsType,
} from "./types";

const initialState: ISearchState = {
    query: '',
};

const searchReducer = (state = initialState, action: SearchActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case SET_SEARCH_QUERY:
            return {
              ...state,
              query: payload
            };
        case CLEAR_SEARCH:
            return initialState;
        default:
            return state;
    }
};

export {
    searchReducer
};
