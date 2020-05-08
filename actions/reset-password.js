export const resetPasswordRequest = () => {
    return {
        type: 'RESET_SEND_REQUEST'
    }
};

export const setResetPasswordSuccess = (payload) => {
    return {
        type: 'RESET_SUCCESS',
        payload: payload
    }
};

export const setResetPasswordError = (payload) => {
    return {
        type: 'RESET_ERROR',
        payload: payload
    }
};
