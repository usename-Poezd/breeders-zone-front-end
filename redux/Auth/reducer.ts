import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {
    AuthActionsType,
    IAuthState,
    LOGIN_ERROR,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    REG_ERROR,
    SET_IS_LOGIN
} from "./types";

const initialState: IAuthState = {
    isLogin: false,
    loginRequest: false,
    regError: {
        message: null,
        errors: null,
        status: null
    },
    loginError: {
        message: null,
        errors: null,
        status: null
    },
};

const authReducer = (state = initialState, action: AuthActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload.auth);
            const wasBumpedOnClient = stateDiff?.isLogin?.[0] === true;
            return {
                ...state,
                ...action.payload.auth,
                isLogin: wasBumpedOnClient ? state.isLogin : action.payload.auth.isLogin
            };
        case SET_IS_LOGIN:
            return {
                ...state,
                isLogin: payload,
            };
        case LOGIN_REQUEST:
            return {
                ...state,
                loginRequest: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                loginRequest: false,
                regError: initialState.regError
            };
        case LOGOUT:
            return {
                ...state,
                isLogin: false,
                loginRequest: false,
            };

        case REG_ERROR:
            return {
                ...state,
                isLogin: false,
                loginRequest: false,
                regError: payload
            };
        case LOGIN_ERROR:
            return {
                ...state,
                isLogin: false,
                loginRequest: false,
                loginError: payload
            };
        default:
            return state;
    }
};

export {
    authReducer
};
