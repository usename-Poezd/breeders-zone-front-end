import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {
    ADD_NOTIFICATION,
    CLEAR_USER_NOTIFICATIONS_COUNT,
    IProfileState, PROFILE_CLEAR,
    PROFILE_UPDATE_ERROR,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS, ProfileActionsType,
    SET_USER, SET_USER_GUARD_XP, SET_USER_NEW_GUARD_LEVEL,
    USER_CLEAR
} from "./types";

const initialState: IProfileState = {
    user: null,
    update: {
        request: false,
        success: null,
        error: {
            errors: [],
            status: null
        }
    }
};

const profileReducer = (state = initialState, action: ProfileActionsType) => {
    const payload = action.payload;

    switch (action.type) {
        case SET_USER:
            return  {
                ...state,
                user: payload
            };
        case USER_CLEAR:
            return  {
                ...state,
                user: initialState.user
            };
        case PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                update: {
                    success: payload,
                    request: false,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case PROFILE_UPDATE_ERROR:
            return {
                ...state,
                update: {
                    previews: [],
                    success: null,
                    request: false,
                    error: payload
                }
            };
        case PROFILE_UPDATE_REQUEST:
            return  {
                ...state,
                update: {
                    success: null,
                    request: true,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case PROFILE_CLEAR:
            return {
                ...state,
                update: {
                    success: null,
                    request: false,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case SET_USER_GUARD_XP:
            return {
                ...state,
                user: {
                    ...state.user,
                    guard_XP: payload
                }
            };
        case SET_USER_NEW_GUARD_LEVEL:
            return {
                ...state,
                user: {
                    ...state.user,
                    guard_level: payload,
                    guard_XP: 0
                }
            };
        case CLEAR_USER_NOTIFICATIONS_COUNT:
            return {
                ...state,
                user: {
                    ...state.user,
                    unread_notifications_count: 0
                }
            };
        case ADD_NOTIFICATION:
            return {
                ...state,
                user: {
                    ...state.user,
                    notifications: [payload, ...state.user.notifications],
                    unread_notifications_count: ++state.user.unread_notifications_count
                }
            };
        default:
            return state;
    }
};

export {
    profileReducer
};

