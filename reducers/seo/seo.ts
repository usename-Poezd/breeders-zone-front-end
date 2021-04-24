import {HYDRATE} from "next-redux-wrapper";
import {AnyAction} from "redux";
import {DefaultSeoProps} from "next-seo/lib/types";

const initialState: DefaultSeoProps = {

};

const seo = (state = initialState, action: AnyAction) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...payload.seo,
            };
        case "SET_SEO":
            return {
                ...state,
                ...payload
            };
        default:
            return state
    }
};

export default seo;
