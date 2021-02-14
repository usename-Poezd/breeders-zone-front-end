import {IShop, IUser} from "../../types";
import {AnyAction} from "redux";

const SET_USER = 'SET_USER';
const USER_CLEAR = 'USER_CLEAR';
const PROFILE_CHANGE_PASSWORD = 'PROFILE_CHANGE_PASSWORD';
const SET_PROFILE_PREVIEW = 'SET_PROFILE_PREVIEW';
const DELETE_PROFILE_PREVIEW = 'DELETE_PROFILE_PREVIEW';
const PROFILE_UPDATE_SUCCESS = 'PROFILE_UPDATE_SUCCESS';
const PROFILE_UPDATE_ERROR = 'PROFILE_UPDATE_ERROR';
const PROFILE_UPDATE_REQUEST = 'PROFILE_UPDATE_REQUEST';
const PROFILE_CLEAR = 'PROFILE_CLEAR';
const SET_USER_GUARD_XP = 'SET_USER_GUARD_XP';
const SET_USER_NEW_GUARD_LEVEL = 'SET_USER_NEW_GUARD_LEVEL';
const CLEAR_USER_NOTIFICATIONS_COUNT = 'CLEAR_USER_NOTIFICATIONS_COUNT';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export interface ISetUserAction {
    type: typeof SET_USER,
    payload: IUser|IShop
}

export interface IClearUserAction {
    type: typeof USER_CLEAR
    payload?: any
}

export interface IProfileUpdateSuccessAction {
    type: typeof PROFILE_UPDATE_SUCCESS
    payload: string
}
export interface IProfileUpdateErrorAction {
    type: typeof PROFILE_UPDATE_ERROR
    payload: {
        errors: Array<null>,
        status: number
    }
}
export interface IClearProfileAction {
    type: typeof PROFILE_CLEAR
    payload?: any
}
export interface IProfileUpdateRequestAction {
    type: typeof PROFILE_UPDATE_REQUEST
    payload?: any
}
export interface IClearUserNotificationsCountAction {
    type: typeof CLEAR_USER_NOTIFICATIONS_COUNT
    payload?: any
}
export interface IAddNotificationAction {
    type: typeof ADD_NOTIFICATION
    payload: any
}


export interface IProfileState {
    user: IUser|null,
    update: {
        request: boolean,
        success: string|null,
        error: {
            errors: Array<null>,
            status: number|null
        }
    }
}

export type ProfileActionsType = ISetUserAction
    | IClearUserAction
    | IProfileUpdateSuccessAction
    | IProfileUpdateErrorAction
    | IClearProfileAction
    | IProfileUpdateRequestAction
    | IClearUserNotificationsCountAction
    | IAddNotificationAction
    | AnyAction

export {
    SET_USER,
    USER_CLEAR,
    PROFILE_CHANGE_PASSWORD,
    SET_PROFILE_PREVIEW,
    DELETE_PROFILE_PREVIEW,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_ERROR,
    PROFILE_UPDATE_REQUEST,
    PROFILE_CLEAR,
    SET_USER_GUARD_XP,
    SET_USER_NEW_GUARD_LEVEL,
    CLEAR_USER_NOTIFICATIONS_COUNT,
    ADD_NOTIFICATION,
}
