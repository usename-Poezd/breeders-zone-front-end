import {AnyAction} from "redux";
import {IRegistrationData} from "../../types";

const REGISTRATION = 'REGISTRATION';
const GET_USER = 'GET_USER';
const LOGIN = 'LOGIN';
const SET_IS_LOGIN = 'SET_IS_LOGIN';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const REG_ERROR = 'REG_ERROR';
const LOGIN_ERROR = 'LOGIN_ERROR';

export interface IAuthState {
    isLogin: boolean,
    loginRequest: boolean,

    regError: {
        message: string|null,
        errors: Array<any>|null,
        status: number|null
    },
    loginError: {
        message: string|null,
        errors: Array<any>|null,
        status: number|null
    },
}

export interface IRegistrationAction {
    type: typeof REGISTRATION,
    payload: IRegistrationData
}

export interface IGetUserAction {
    type: typeof GET_USER,
    payload?: any
}

export interface ILoginAction {
    type: typeof LOGIN,
    payload: {
        email: string,
        password: string,
    }
}

export interface ISetIsLoginAction {
    type: typeof SET_IS_LOGIN,
    payload: boolean
}

export interface ILoginRequestAction {
    type: typeof LOGIN_REQUEST,
    payload?: any
}

export interface ILoginSuccessAction {
    type: typeof LOGIN_SUCCESS,
    payload?: any
}

export interface ILogoutAction {
    type: typeof LOGOUT,
    payload?: any
}

export interface IAuthErrorAction {
    type: typeof REG_ERROR|typeof LOGIN_ERROR,
    payload: {
        status: boolean,
        errors: any
    }
}

export type AuthActionsType =  IRegistrationAction
    | ILoginAction
    | IGetUserAction
    | ISetIsLoginAction
    | ILoginRequestAction
    | ILoginSuccessAction
    | ILogoutAction
    | IAuthErrorAction
    | AnyAction

export {
    GET_USER,
    SET_IS_LOGIN,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    REG_ERROR,
    LOGIN,
    LOGIN_ERROR,
    REGISTRATION
}
