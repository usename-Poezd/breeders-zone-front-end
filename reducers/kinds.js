import initialState from "./initialState";

const kinds = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.kinds;
    }

    switch (action.type) {
        case 'SET_KINDS':
            return {
                ...state,
                all: payload.kinds,
                active: payload.activeKinds
            };
        case 'SET_ACTIVE_KIND':
            return {
                ...state,
                activeKind:  payload
            };
        default:
            return state;
    }
};

export default kinds;
