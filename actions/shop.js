import {DataService} from "../services";

const dataService = new DataService();

export const setShopUpdateRequest = () => {
    return {
        type: 'SHOP_UPDATE_REQUEST'
    }
};

export const setShopUpdateSuccess = (payload) => {
    return {
        type: 'SHOP_UPDATE_SUCCESS',
        payload: payload
    }
};

export const setShopUpdateError = (payload) => {
    return {
        type: 'SHOP_UPDATE_ERROR',
        payload: payload
    }
};

export const setShopPreview = (payload) => {
    return {
        type: 'PUSH_SHOP_PREVIEWS',
        payload: payload
    }
};

export const shopUpdateClear = () => {
    return {
        type: 'SHOP_CLEAR'
    }
};

export const setShopProductsRequest = () => {
    return {
        type: 'SET_SHOP_PRODUCTS_REQUEST'
    }
};

export const setShopProducts = (payload) => {
    return {
        type: 'SET_SHOP_PRODUCTS',
        payload: payload
    }
};

export const clearShopProducts = () => {
    return {
        type: 'CLEAR_SHOP_PRODUCTS'
    }
};

export const clearShopDivorces = () => {
    return {
        type: 'CLEAR_SHOP_DIVORCES'
    }
};

export const deleteShopProduct = (payload) => {
    return {
        type: 'DELETE_PRODUCT',
        payload: payload
    }
};

export const setShopDivorcesRequest = () => {
    return {
        type: 'SET_SHOP_DIVORCES_REQUEST'
    }
};

export const setShopDivorces = (payload) => {
    return {
        type: 'SET_SHOP_DIVORCES',
        payload
    }
};

export const deleteShopDivorce = (payload) => {
    dataService.deleteDivorce(payload);
    return {
        type: 'DELETE_SHOP_DIVORCE',
        payload
    }
};
