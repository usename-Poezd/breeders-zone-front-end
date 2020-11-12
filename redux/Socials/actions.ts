import {ISocial} from "../../types";
import {ISetSocialsAction, SET_SOCIALS} from "./types";


export const setSocials = (payload: Array<ISocial>): ISetSocialsAction => {
    return {
        type: SET_SOCIALS,
        payload
    }
};
