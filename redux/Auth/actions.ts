import {DataService} from "../../services";

import {
    GET_USER,
    IGetUserAction,
    ILoginAction,
    ILoginRequestAction,
    ILoginSuccessAction, IAuthErrorAction,
    ISetIsLoginAction,
    LOGIN,
    LOGIN_REQUEST, LOGIN_ERROR,
    LOGIN_SUCCESS, LOGOUT, REG_ERROR, SET_IS_LOGIN, REGISTRATION, IRegistrationAction
} from "./types";
import {IRegistrationData} from "../../types";

const dataService = new DataService();

export const registration = (data: IRegistrationData): IRegistrationAction => {
    return {
        type: REGISTRATION,
        payload: data
    }
};

export const login = (data: {email: string, password: string}): ILoginAction => {
    return {
        type: LOGIN,
        payload: data
    }
};

export const loginRequest = (): ILoginRequestAction => {
    return {
        type: LOGIN_REQUEST
    }
};

export const loginSuccess = (): ILoginSuccessAction => {
    return {
        type: LOGIN_SUCCESS
    }
};

export const logout = (tokenNotWork= false) => (dispatch, getState) => {
    const state = getState();
    dispatch({ type: LOGOUT });
    if (!tokenNotWork)
        dataService.postLogout();
    window.Echo.leaveChannel(`private-room.${state.chat.selected_room_id}`);
    window.Echo.leaveChannel(`private-App.User.${state.profile.user.id}`);
    window.Echo.disconnect();
    dispatch({ type: 'USER_CLEAR'});
};

export const setUser = (payload) => {
    return {
        type: 'SET_USER',
        payload: payload
    }
};

export const getUser = (): IGetUserAction => {
    return {
        type: GET_USER
    }
};

export const setRegError = (payload): IAuthErrorAction => {
    return {
        type: REG_ERROR,
        payload: payload
    }
};


export const setLoginError = (payload): IAuthErrorAction => {
    return {
        type: LOGIN_ERROR,
        payload: payload
    }
};


export const setIsLogin = (payload: boolean): ISetIsLoginAction => {
    return {
        type: SET_IS_LOGIN,
        payload
    }
};
