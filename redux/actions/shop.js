import {DataService} from "../../services";

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
        type: 'PUSH_SHOP_UPDATE_PREVIEWS',
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

export const activeShopProduct = (id) => (dispatch, getState) => {
    const products = getState().shop.products;

    const productIdx = products.findIndex((item) => item.id === id);

    if (productIdx >= 0) {
        products[productIdx].is_active = !products[productIdx].is_active;

        dispatch({
            type: 'ACTIVE_SHOP_PRODUCTS',
            payload: products
        });
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
