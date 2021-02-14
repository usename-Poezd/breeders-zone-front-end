import {
    ACTIVE_SHOP_PRODUCT,
    CLEAR_SHOP_DIVORCES,
    CLEAR_SHOP_PRODUCTS,
    DELETE_PRODUCT,
    DELETE_DIVORCE,
    IActiveShopProductAction,
    IClearShoDivorcesAction,
    IClearShoProductsAction, IDeleteProductAction, ISetShopDivorcesAction, ISetShopDivorcesRequestAction,
    ISetShopProductsAction,
    ISetShopProductsRequestAction,
    ISetShopUpdateErrorAction,
    ISetShopUpdateSuccessAction,
    IShopUpdateClearAction,
    SET_SHOP_DIVORCES,
    SET_SHOP_DIVORCES_REQUEST,
    SET_SHOP_PRODUCTS,
    SET_SHOP_PRODUCTS_REQUEST,
    SHOP_UPDATE_CLEAR,
    SHOP_UPDATE_ERROR,
    SHOP_UPDATE_SUCCESS, IDeleteDivorceAction
} from "./types";
import {IDivorce, IProduct} from "../../types";
import {ThunkAction} from "redux-thunk";
import {IRootState} from "../store";

export const setShopUpdateSuccess = (payload: string|undefined): ISetShopUpdateSuccessAction => {
    return {
        type: SHOP_UPDATE_SUCCESS,
        payload
    }
};

export const setShopUpdateError = (payload: {errors: Array<any>, status: number|null}): ISetShopUpdateErrorAction => {
    return {
        type: SHOP_UPDATE_ERROR,
        payload
    }
};


export const shopUpdateClear = (): IShopUpdateClearAction => {
    return {
        type: SHOP_UPDATE_CLEAR
    }
};

export const setShopProductsRequest = (payload: boolean = true): ISetShopProductsRequestAction => {
    return {
        type: SET_SHOP_PRODUCTS_REQUEST,
        payload
    }
};

export const setShopProducts = (payload: {
    data: Array<IProduct>
    meta: {
        current_page: number,
        last_page: number
        from: number
        to: number
        per_page: number
        total: number
        selected_morphs: Array<any>
        selected_localities: Array<any>
        selected_subcategory: Array<any>
    }
}): ISetShopProductsAction => {
    return {
        type: SET_SHOP_PRODUCTS,
        payload: payload
    }
};

export const clearShopProducts = (): IClearShoProductsAction => {
    return {
        type: CLEAR_SHOP_PRODUCTS
    }
};

export const clearShopDivorces = (): IClearShoDivorcesAction => {
    return {
        type: CLEAR_SHOP_DIVORCES
    }
};


export const activeShopProduct = (id: number): ThunkAction<void, IRootState, any, IActiveShopProductAction> => (dispatch, getState) => {
    const products = getState().shop.products.data;

    const productIdx = products.findIndex((item) => item.id === id);

    if (productIdx >= 0) {
        products[productIdx].is_active = !products[productIdx].is_active;

        dispatch({
            type: ACTIVE_SHOP_PRODUCT,
            payload: products
        });
    }
};

export const deleteProduct = (payload: number): IDeleteProductAction => {
    return {
        type: DELETE_PRODUCT,
        payload: payload
    }
};

export const setShopDivorcesRequest = (payload = true): ISetShopDivorcesRequestAction => {
    return {
        type: SET_SHOP_DIVORCES_REQUEST,
        payload
    }
};

export const setShopDivorces = (payload: {
    data: Array<IDivorce>
    meta: {
        current_page: number,
        last_page: number
        from: number
        to: number
        per_page: number
        total: number
    }
}): ISetShopDivorcesAction => {
    return {
        type: SET_SHOP_DIVORCES,
        payload
    }
};

export const deleteDivorce = (payload: number): IDeleteDivorceAction => {
    return {
        type: DELETE_DIVORCE,
        payload
    }
};
