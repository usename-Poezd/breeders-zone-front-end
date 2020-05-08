import {DataService} from "../services";
const dataService = new DataService();


export const setProfileChangePassword = () => {
    return {
        type: 'PROFILE_CHANGE_PASSWORD'
    }
};

export const setProfilePreview = (payload) => {
    return {
        type: 'SET_PROFILE_PREVIEW',
        payload
    }
};

export const deleteProductPreview = (payload) => {
    return {
        type: 'DELETE_PROFILE_PREVIEW',
        payload
    }
};

export const setProfileUpdateSuccess = (payload) => {
    return {
        type: 'PROFILE_UPDATE_SUCCESS',
        payload: payload
    }
};

export const setProfileUpdateError = (payload) => {
    return {
        type: 'PROFILE_UPDATE_ERROR',
        payload: payload
    }
};

export const clearProfileState = () => {
    return {
        type: 'PROFILE_CLEAR'
    }
};

export const profileUpdateRequest = () => {
    return {
        type: 'PROFILE_UPDATE_REQUEST'
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
