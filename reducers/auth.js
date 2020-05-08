import initialState from "./initialState";

const auth = (state, action) => {


    const payload = action.payload;
    if (state === undefined) {
        return initialState.auth;
    }

    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                ...state,
                isLogin: true,
                loginRequest: true
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLogin: true,
                loginRequest: false
            };
        case 'LOGOUT':
            return {
                ...state,
                isLogin: false,
                loginRequest: false,
            };

        case 'REG_ERROR':
            return {
                ...state,
                isLogin: false,
                loginRequest: false,
                regError: payload
            };
        default:
            return state;
    }
};

export default auth;
