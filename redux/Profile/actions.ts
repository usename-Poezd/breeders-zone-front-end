import {DataService} from "../../services";
import {
    ADD_NOTIFICATION,
    CLEAR_USER_NOTIFICATIONS_COUNT,
    IAddNotificationAction,
    IClearUserAction,
    IClearUserNotificationsCountAction,
    IProfileUpdateErrorAction,
    IProfileUpdateRequestAction,
    IProfileUpdateSuccessAction,
    PROFILE_UPDATE_ERROR,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS,
    USER_CLEAR
} from "./types";

const dataService = new DataService();

export const profileUpdateSuccess = (payload: string): IProfileUpdateSuccessAction => {
    return {
        type: PROFILE_UPDATE_SUCCESS,
        payload: payload
    }
};

export const profileUpdateError = (payload: {errors: any, status: number}): IProfileUpdateErrorAction => {
    return {
        type: PROFILE_UPDATE_ERROR,
        payload: payload
    }
};

export const clearProfileState = (): IClearUserAction => {
    return {
        type: USER_CLEAR
    }
};

export const profileUpdateRequest = (): IProfileUpdateRequestAction => {
    return {
        type: PROFILE_UPDATE_REQUEST
    }
};

export const setUserGuardXP = () => (dispatch, getState) => {
    const state = getState();
    const payload = state.profile.user.guard_XP + 25;

    dispatch({
        type: 'SET_USER_GUARD_XP',
        payload
    });

    if (state.profile.user.XP + 25 >= 1000) {
        dataService.getGuardLevel(state.profile.user.guard_level.level + 1)
            .then((data) => {
                dispatch({
                    type: 'SET_USER_NEW_GUARD_LEVEL',
                    payload: data
                })
            });
    }
};

export const clearUserNotificationsCount = (): IClearUserNotificationsCountAction => {
    dataService.checkNotifications();

    return {
        type: CLEAR_USER_NOTIFICATIONS_COUNT
    }
};

export const addNotification = (payload): IAddNotificationAction => {
     return {
         type: ADD_NOTIFICATION,
         payload: {
             id: payload.id,
             type: payload.type,
             data: {
                 ...payload
             }
         }
     }
};
