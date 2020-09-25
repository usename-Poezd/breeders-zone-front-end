import {ISocial} from "../reducers/socials/types";

export const setSocials = (payload: Array<ISocial>) => {
    return {
        type: 'SET_SOCIALS',
        payload
    }
};
