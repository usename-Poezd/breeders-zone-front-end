import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {
    ACTIVE_SHOP_PRODUCT, CLEAR_SHOP_DIVORCES, CLEAR_SHOP_PRODUCTS, DELETE_PRODUCT, DELETE_DIVORCE,
    IShopState, SET_SHOP_DIVORCES, SET_SHOP_DIVORCES_REQUEST,
    SET_SHOP_PRODUCTS, SET_SHOP_PRODUCTS_REQUEST,
    SHOP_UPDATE_CLEAR,
    SHOP_UPDATE_ERROR,
    SHOP_UPDATE_SUCCESS, ShopsActionsType
} from "./types";

const initialState: IShopState = {
    products: {
        ok: null,
        data: [],
        meta: null
    },
    productsRequest: false,
    divorces: {
        data: []
    },
    divorcesRequest: false,
    update: {
        success: null,
        error: {
            errors: [],
            status: null
        }
    }
};

const shopReducer = (state = initialState, action: ShopsActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.shop);
            return {
                ...state,
                ...action.payload.shop,
                products: state.products?.meta?.total && stateDiff?.products?.meta?.total === state.products?.meta?.total ? state.products : action.payload.shop.products,
                divorces: state.divorces?.meta?.total && stateDiff?.divorces?.meta?.total === state.divorces?.meta?.total ? state.divorces : action.payload.shop.divorces
            };
        case SHOP_UPDATE_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    success: payload,
                    request: false
                }
            };
        case SHOP_UPDATE_ERROR:
            return {
                ...state,
                update: {
                    ...state.update,
                    error: payload,
                    request: false
                }
            };
        case SHOP_UPDATE_CLEAR:
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
        case SET_SHOP_PRODUCTS:
            return {
                ...state,
                products: payload,
                productsRequest: false
            };
        case ACTIVE_SHOP_PRODUCT:
            return {
                ...state,
                products: {
                    ...state.products,
                    data: [...payload]
                }
            };
        case SET_SHOP_PRODUCTS_REQUEST:
            return {
                ...state,
                productsRequest: true
            };
        case CLEAR_SHOP_PRODUCTS:
            return {
                ...state,
                products: {
                    data: []
                },
                productsRequest: false
            };
        case CLEAR_SHOP_DIVORCES:
            return {
                ...state,
                divorces: {
                    data: []
                }
            };
        case DELETE_PRODUCT:
            const products = state.products.data;
            const productIdx = products.findIndex((item) => item.id === payload);
            products.splice(productIdx, 1);
            return {
                ...state,
                products: {
                    data: [...products]
                }
            };
        case SET_SHOP_DIVORCES_REQUEST:
            return {
                ...state,
                divorcesRequest: true
            };
        case SET_SHOP_DIVORCES:
            return {
                ...state,
                divorces: payload,
                divorcesRequest: false
            };
        case DELETE_DIVORCE:
            const divorces = state.divorces.data;
            const divorceIdx = divorces.findIndex((item) => item.id === payload);
            divorces.splice(divorceIdx, 1);
            return {
                ...state,
                divorces: {
                    data: [...divorces]
                }
            };
        default:
            return state;
    }
};

export {
    shopReducer
};
