import initialState from "./initialState";

const search = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.search;
    }

    switch (action.type) {
        case 'SET_SEARCH_QUERY':
            return {
              ...state,
              query: payload
            };
        case 'SET_SEARCH_SELECTED_KIND':
            return {
                ...state,
                selectedKind: payload,
                subcategoryId: payload.subcategories ? payload.subcategories[0]?.id : null
            };
        case 'SET_SEARCH_PRICE_FROM':
            return {
                ...state,
                priceFrom: payload
            };
        case 'SET_SEARCH_PRICE_TO':
            return {
                ...state,
                priceTo: payload
            };
        case 'SET_SEARCH_MIN_MORPHS':
            return {
                ...state,
                minMorphs: payload
            };
        case 'SET_SEARCH_MAX_MORPHS':
            return {
                ...state,
                maxMorphs: payload
            };
        case 'SET_SEARCH_SEX':
            return {
                ...state,
                sex: payload
            };
        case 'SET_SEARCH_AGE':
            return {
                ...state,
                age: payload
            };
        case 'SET_SEARCH_SUBCATEGORY_ID':
            return {
                ...state,
                subcategoryId: payload
            };
        case 'SET_SEARCH_LOCALITY':
            return {
                ...state,
                localityId: payload
            };
        case 'SET_SEARCH_MORPHS_IN_REQUEST':
            return {
                ...state,
                searchMorphsInRequest: payload
            };
        case 'SET_SEARCH_MORPH_RESULT_IN':
            return {
                ...state,
                searchMorphResultIn: payload
            };
        case 'SET_SELECTED_MORPH_IN':
            return {
                ...state,
                morphsIn: [...state.morphsIn, state.searchMorphResultIn[payload]]
            };
        case 'DELETE_SELECTED_MORPH_IN':
            const morphsIn = state.morphsIn;
            morphsIn.splice(payload, 1);
            return {
                ...state,
                morphsIn: [...morphsIn]
            };
        case 'CLEAR_SEARCH_MORPH_RESULT_IN':
            return {
                ...state,
                searchMorphResultIn: []
            };
        case 'SET_SEARCH_MORPHS_OUT_REQUEST':
            return {
                ...state,
                searchMorphsOutRequest: payload
            };
        case 'SET_SEARCH_MORPH_RESULT_OUT':
            return {
                ...state,
                searchMorphResultOut: payload
            };
        case 'SET_SELECTED_MORPH_OUT':
            return {
                ...state,
                morphsOut: [...state.morphsOut, state.searchMorphResultOut[payload]]
            };
        case 'DELETE_SELECTED_MORPH_OUT':
            const morphsOut = state.morphsIn;
            morphsOut.splice(payload, 1);
            return {
                ...state,
                morphsOut: [...morphsOut]
            };
        case 'CLEAR_SEARCH_MORPH_RESULT_OUT':
            return {
                ...state,
                searchMorphResultOut: []
            };
        case 'CLEAR_SEARCH':
            return initialState.search;
        default:
            return state;
    }
};

export default search;
