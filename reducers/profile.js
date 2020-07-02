import initialState from "./initialState";
import {HYDRATE} from "next-redux-wrapper";

const profile = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.profile;
    }

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...action.payload.profile
            };
        case 'GET_USER':
            return  {
                ...state,
                user: payload
            };
        case 'USER_CLEAR':
            return  {
                ...state,
                user: initialState.profile.user
            };
        case 'PROFILE_CHANGE_PASSWORD':
            const changePassword = state.changePassword;
            return {
                ...state,
                changePassword: !changePassword
            };
        case 'SET_PROFILE_PREVIEW':
            return {
                ...state,
                update: {
                    ...state.update,
                    previews: payload
                }
            };
        case 'DELETE_PROFILE_PREVIEW':
            state.update.previews.splice(payload, 1);
            return {
                ...state,
                update: {
                    ...state.update,
                    previews: [...state.update.previews]
                }
            };
        case 'PROFILE_UPDATE_SUCCESS':
            return {
                ...state,
                changePassword: false,
                update: {
                    previews: [],
                    success: payload,
                    request: false,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case 'PROFILE_UPDATE_ERROR':
            return {
                ...state,
                changePassword: false,
                update: {
                    previews: [],
                    success: null,
                    request: false,
                    error: payload
                }
            };
        case 'PROFILE_UPDATE_REQUEST':
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
        case 'PROFILE_CLEAR':
            return {
                ...state,
                update: {
                    previews: [],
                    success: null,
                    request: false,
                    error: {
                        errors: null,
                        status: null
                    }
                }
            };
        case 'SET_USER_GUARD_XP':
            return {
                ...state,
                user: {
                    ...state.user,
                    guard_XP: payload
                }
            };
        case 'SET_USER_NEW_GUARD_LEVEL':
            return {
                ...state,
                user: {
                    ...state.user,
                    guard_level: payload,
                    XP: 0
                }
            };
        case 'CLEAR_USER_NOTIFICATIONS_COUNT':
            return {
                ...state,
                user: {
                    ...state.user,
                    unread_notifications_count: 0
                }
            };
        case 'ADD_NOTIFICATION':
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

export default profile;

