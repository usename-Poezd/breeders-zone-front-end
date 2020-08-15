import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const shop = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.shop;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.shop);
            return {
                ...state,
                ...action.payload.shop,
                products: state.products.total && stateDiff?.products?.total === state.products.total ? state.products : action.payload.shop.products,
                divorces: state.divorces.total && stateDiff?.divorces?.total === state.divorces.total ? state.divorces : action.payload.shop.divorces
            };
        case 'SHOP_UPDATE_REQUEST':
            return {
                ...state,
                update: {
                    request: true,
                    success: null,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case 'SHOP_UPDATE_SUCCESS':
            return {
                ...state,
                update: {
                    ...state.update,
                    success: payload,
                    request: false
                }
            };
        case 'SHOP_UPDATE_ERROR':
            return {
                ...state,
                update: {
                    ...state.update,
                    error: payload,
                    request: false
                }
            };
        case 'SHOP_CLEAR':
            return {
                ...state,
                update: {
                    previews: [],
                    request: false,
                    success: null,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case 'PUSH_SHOP_UPDATE_PREVIEWS':
            return {
                ...state,
                update: {
                    ...state.update,
                    previews: payload
                }
            };
        case 'SET_SHOP_PRODUCTS':
            return {
                ...state,
                products: payload,
                productsRequest: false
            };
        case 'ACTIVE_SHOP_PRODUCTS':
            return {
                ...state,
                products: [...payload]
            };
        case 'SET_SHOP_PRODUCTS_REQUEST':
            return {
                ...state,
                productsRequest: true
            };
        case 'CLEAR_SHOP_PRODUCTS':
            return {
                ...state,
                products: [],
                productsRequest: false
            };
        case 'CLEAR_SHOP_DIVORCES':
            return {
                ...state,
                divorces: initialState.shop.divorces
            };
        case 'DELETE_PRODUCT':
            const products = state.products;
            products.splice(payload.idx, 1);
            return {
                ...state,
                products: [...products]
            };
        case 'SET_SHOP_DIVORCES_REQUEST':
            return {
                ...state,
                divorcesRequest: true
            };
        case 'SET_SHOP_DIVORCES':
            return {
                ...state,
                divorces: payload,
                divorcesRequest: false
            };
        case 'DELETE_SHOP_DIVORCE':
            const divorces = state.divorces;
            const idx = divorces.findIndex((item) => item.id === payload);
            divorces.splice(idx, 1);
            return {
                ...state,
                divorces: [...divorces]
            };
        default:
            return state;
    }
};

export default shop;
