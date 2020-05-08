import initialState from "./initialState";

const resetPassword = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.resetPasswordState;
    }

    switch (action.type) {
        case 'RESET_SEND_REQUEST':
            return {
                request: true,
                success: null,
                error: {
                    errors: null,
                    status: null
                }
            };
        case 'RESET_SUCCESS':
            return {
                request: false,
                success: payload,
                error: {
                    errors: null,
                    status: null
                }
            };
        case 'RESET_ERROR':
            return {
                request: false,
                success: null,
                error: {
                    ...payload
                }
            };
        default:
            return state;
    }
};

export default resetPassword;
