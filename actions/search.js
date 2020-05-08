import {push} from "connected-next-router";

const qs = require('qs');

export const setSearchQuery = (payload) => {
    return  {
        type: 'SET_SEARCH_QUERY',
        payload
    }
};

export const search = () => (dispatch, getState) => {
    const {search} = getState();
    const optionsMorphsIn = search.morphsIn.map((item) => ({
        gene: item.id,
        trait: item.trait.id
    }));

    const optionsMorphsOut = search.morphsOut.map((item) => ({
        gene: item.id,
        trait: item.trait.id
    }));

    const optionsSelectedLocalities = search.selectedLocalities.map((item) => item.id);

    const options = qs.stringify({
        q: search.query,
        kindId: search.selectedKind.id,
        subcategoryId: search.subcategoryId,
        localities: optionsSelectedLocalities,
        priceFrom: search.priceFrom,
        priceTo: search.priceTo,
        morphsIn: optionsMorphsIn,
        morphsOut: optionsMorphsOut,
        sex: search.sex,
        age: search.age,
        minMorphs: search.minMorphs,
        maxMorphs: search.maxMorphs,

    });
    dispatch(push('/search?' + options));
};

export const setSearchSelectedKind = (payload) => (dispatch, getState)=> {
    const state = getState();
    const selectedKind = state.kinds.all.find((item) => item.id === payload);
    dispatch({
        type: 'SET_SEARCH_SELECTED_KIND',
        payload: selectedKind
    });
};

export const setSearchLocality = (payload) => {
    return {
        type: 'SET_SEARCH_LOCALITY',
        payload
    }
};

export const deleteSearchLocality = (payload) => {
    return {
        type: 'DELETE_SEARCH_LOCALITY',
        payload
    }
};

export const updateSearchLocality = (payload) => {
    return {
        type: 'UPDATE_SEARCH_LOCALITY',
        payload
    };
};

export const setSearchPriceFrom = (payload) => {
    return {
        type: 'SET_SEARCH_PRICE_FROM',
        payload
    }
};

export const setSearchPriceTo = (payload) => {
    return {
        type: 'SET_SEARCH_PRICE_TO',
        payload
    }
};

export const setSearchMorphResultIn = (payload) => {
    return {
        type: 'SET_SEARCH_MORPH_RESULT_IN',
        payload
    }
};

export const setSelectedMorphIn = (payload) => (dispatch, getState) => {
    const state = getState();
    const searchMorphResultIn = state.search.searchMorphResultIn;
    const filteredArray = state.search.morphsIn.filter((gene) => gene.id === searchMorphResultIn[payload].id && gene.trait.id === searchMorphResultIn[payload].trait.id);

    if (filteredArray.length === 0) {
        dispatch({
            type: 'SET_SELECTED_MORPH_IN',
            payload
        })
    }
};

export const deleteMorphIn = (payload) => {
    return {
        type: 'DELETE_SELECTED_MORPH_IN',
        payload
    }
};

export const clearSearchMorphResultIn = () => {
    return {
        type: 'CLEAR_SEARCH_MORPH_RESULT_IN'
    }
};

export const setSearchMorphResultOut = (payload) => {
    return {
        type: 'SET_SEARCH_MORPH_RESULT_OUT',
        payload
    }
};

export const setSelectedMorphOut = (payload) =>  (dispatch, getState) =>{
    const state = getState();
    const searchMorphResultOut = state.search.searchMorphResultOut;
    const filteredArray = state.search.morphsOut.filter((gene) => gene.id === searchMorphResultOut[payload].id);

    if (filteredArray.length === 0) {
        dispatch({
            type: 'SET_SELECTED_MORPH_OUT',
            payload
        })
    }
};

export const deleteMorphOut = (payload) => {
    return {
        type: 'DELETE_SELECTED_MORPH_OUT',
        payload
    }
};

export const clearSearchMorphResultOut = () => {
    return {
        type: 'CLEAR_SEARCH_MORPH_RESULT_OUT'
    }
};

export const setSearchMinMorphs = (payload) => {
    return {
        type: 'SET_SEARCH_MIN_MORPHS',
        payload
    }
};

export const setSearchMaxMorphs = (payload) => {
    return {
        type: 'SET_SEARCH_MAX_MORPHS',
        payload
    }
};

export const setSearchSex = (payload) => {
    return {
        type: 'SET_SEARCH_SEX',
        payload
    }
};

export const setSearchAge = (payload) => {
    return {
        type: 'SET_SEARCH_AGE',
        payload
    }
};

export const setSearchSubcategoryId = (payload) => {
    return {
        type: 'SET_SEARCH_SUBCATEGORY_ID',
        payload
    }
};

export const clearSearch = () => {
    return {
        type: 'CLEAR_SEARCH'
    }
};
