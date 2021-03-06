import {DataService} from "../services";
import moment from "moment";
import {Dispatch} from "redux";

const dataService = new DataService();

export const setProductUpdateRequest = () => {
    return {
        type: 'PRODUCT_UPDATE_REQUEST'
    }
};

export const setProductUpdateSuccess = (payload: string) => {
    return {
        type: 'PRODUCT_UPDATE_SUCCESS',
        payload: payload
    }
};

export const setProductUpdateError = (payload: any) => {
    return {
        type: 'PRODUCT_UPDATE_ERROR',
        payload: payload
    }
};
export const productUpdateClear = () => {
    return {
        type: 'PRODUCT_CLEAR'
    }
};

export const setProductCb = (payload: Date|string) => {
    let newPayload = payload;
    if (payload) {
        newPayload = moment(payload).toISOString(true);
    }
    return {
        type: 'SET_PRODUCT_CB',
        payload: newPayload
    }
};

export const clearGetProductRequest = () => {
    return {
        type: 'CLEAR_GET_PRODUCT_REQUEST'
    }
};

export const setGetProductRequest = () => {
    return {
        type: 'SET_GET_PRODUCT_REQUEST'
    }
};

export const setAcceptedFiles = (payload: Array<File>) => {
    const previews = [];
    const acceptedFiles = payload;
    for (let item of payload){
        previews.push(URL.createObjectURL(item))
    }
    const newPayload = {
        acceptedFiles,
        previews
    };
    return {
        type: 'SET_PRODUCT_ACCEPTED_FILES',
        payload: newPayload
    }
};

export const deleteAcceptedFile = (payload: number) => {
    return {
        type: 'DELETE_PRODUCT_ACCEPTED_FILE',
        payload: payload
    }
};

export const setProductInfo = (payload: any) => {
    return {
        type: 'SET_PRODUCT_INFO',
        payload: payload
    }
};

export const deleteProductStateImg = (payload: number) =>  {
    return {
        type: 'DELETE_PRODUCT_IMG',
        payload: payload
    }
};

export const productUpdateClearSuccess = () => {
    return {
        type: 'PRODUCT_CLEAR_SUCCESS'
    }
};

export const productUpdateClearError = () => {
    return {
        type: 'PRODUCT_CLEAR_ERROR'
    }
};

export const setProductSearchResult = (payload: any) => {
    return {
        type: 'SET_PRODUCT_SEARCH_RESULT',
        payload
    }
};

export const clearSearchResult = () => {
    return {
        type: 'CLEAR_SEARCH_RESULT'
    }
};

export const setSelectedMorph = (payload: any) => (dispatch: Dispatch, getState) => {
    const state = getState();
    const selectedMorphs = state.product.selectedMorphs;
    const searchResult = state.product.searchResult;
    const filteredArray = selectedMorphs.filter((gene) => gene.id === searchResult[payload].id);
    const morph = searchResult[payload];
    morph.gene = {
        id: morph.id,
        title: morph.title,
        type: morph.type
    };

    if (filteredArray.length === 0) {
        dispatch({
            type: 'SET_SELECTED_MORPHS',
            payload: morph
        });
    }
};

export const deleteSelectedMorph = (payload: number) => {
    return  {
        type: 'DELETE_SELECTED_MORPH',
        payload: payload
    }
};

export const deleteMorphsKind = () => {
    return  {
        type: 'DELETE_MORPHS_KIND'
    }
};

export const clearDeletedMorphsKind = () => {
    return {
        type: 'CLEAR_DELETED_MORPHS_KIND'
    }
};

export const deleteProductReport = (payload: number) => (dispatch: Dispatch, getState) => {
    const productReports = getState().product.info.reports;
    const reportIdx = productReports.findIndex((item) => item.id === payload);
    productReports.splice(reportIdx, 1);

    dataService.checkReport(payload);

    dispatch({
        type: 'DELETE_PRODUCT_REPORT',
        payload: productReports
    })
};

export const setProductSearchRequest = (payload: boolean) => {
    return {
        type: 'SET_PRODUCT_SEARCH_REQUEST',
        payload
    }
};
