import {IDivorce, IProduct} from "../../types";
import {AnyAction} from "redux";

const SHOP_UPDATE_SUCCESS = 'SHOP_UPDATE_SUCCESS';
const SHOP_UPDATE_ERROR = 'SHOP_UPDATE_ERROR';
const SHOP_UPDATE_CLEAR = 'SHOP_UPDATE_CLEAR';
const SET_SHOP_PRODUCTS = 'SET_SHOP_PRODUCTS';
const ACTIVE_SHOP_PRODUCT = 'ACTIVE_SHOP_PRODUCTS';
const SET_SHOP_PRODUCTS_REQUEST = 'SET_SHOP_PRODUCTS_REQUEST';
const CLEAR_SHOP_PRODUCTS = 'CLEAR_SHOP_PRODUCTS';
const CLEAR_SHOP_DIVORCES = 'CLEAR_SHOP_DIVORCES';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const SET_SHOP_DIVORCES_REQUEST = 'SET_SHOP_DIVORCES_REQUEST';
const SET_SHOP_DIVORCES = 'SET_SHOP_DIVORCES';
const DELETE_DIVORCE = 'DELETE_DIVORCE';


export interface ISetShopUpdateSuccessAction {
    type: typeof SHOP_UPDATE_SUCCESS
    payload: string|undefined
}

export interface ISetShopUpdateErrorAction {
    type: typeof SHOP_UPDATE_ERROR
    payload: {errors: Array<any>, status: number|null}
}

export interface IShopUpdateClearAction {
    type: typeof SHOP_UPDATE_CLEAR
    payload?: any
}

export interface ISetShopProductsRequestAction {
    type: typeof SET_SHOP_PRODUCTS_REQUEST
    payload: boolean
}

export interface ISetShopProductsAction {
    type: typeof SET_SHOP_PRODUCTS
    payload: {
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
    }
}

export interface ISetShopDivorcesRequestAction {
    type: typeof SET_SHOP_DIVORCES_REQUEST
    payload: boolean
}

export interface IClearShoProductsAction {
    type: typeof CLEAR_SHOP_PRODUCTS
    payload?: any
}

export interface IClearShoDivorcesAction {
    type: typeof CLEAR_SHOP_DIVORCES
    payload?: any
}

export interface IActiveShopProductAction {
    type: typeof ACTIVE_SHOP_PRODUCT
    payload: Array<IProduct>
}

export interface IDeleteProductAction {
    type: typeof DELETE_PRODUCT
    payload: number
}

export interface ISetShopDivorcesAction {
    type: typeof SET_SHOP_DIVORCES
    payload: {
        data: Array<IDivorce>
        meta: {
            current_page: number,
            last_page: number
            from: number
            to: number
            per_page: number
            total: number
        }
    }
}

export interface IDeleteDivorceAction {
    type: typeof DELETE_DIVORCE
    payload: number
}

export type ShopsActionsType = ISetShopUpdateSuccessAction
    | ISetShopUpdateErrorAction
    | IShopUpdateClearAction
    | ISetShopProductsRequestAction
    | ISetShopProductsAction
    | ISetShopDivorcesRequestAction
    | IClearShoProductsAction
    | IClearShoDivorcesAction
    | IActiveShopProductAction
    | IDeleteProductAction
    | ISetShopDivorcesAction
    | IDeleteDivorceAction
    | AnyAction

export interface IShopState {
    products: {
        ok: boolean|null
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
        }|null
    }
    productsRequest: boolean
    divorces: {
        data: Array<IDivorce>
        meta?: {
            current_page: number,
            last_page: number
            from: number
            to: number
            per_page: number
            total: number
        }
    }
    divorcesRequest: boolean
    update: {
        success: string|null,
        error: {
            errors: Array<any>,
            status: number|null
        }
    }
}

export {
    SHOP_UPDATE_SUCCESS,
    SHOP_UPDATE_ERROR,
    SHOP_UPDATE_CLEAR,
    SET_SHOP_PRODUCTS,
    ACTIVE_SHOP_PRODUCT,
    SET_SHOP_PRODUCTS_REQUEST,
    CLEAR_SHOP_PRODUCTS,
    CLEAR_SHOP_DIVORCES,
    DELETE_PRODUCT,
    SET_SHOP_DIVORCES_REQUEST,
    SET_SHOP_DIVORCES,
    DELETE_DIVORCE
}
