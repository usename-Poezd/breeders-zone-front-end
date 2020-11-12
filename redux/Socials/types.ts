import {ISocial} from "../../types";
import {AnyAction} from "redux";

const SET_SOCIALS = 'SET_SOCIALS';

export interface ISocialsState {
    all: Array<ISocial>
}

export interface ISetSocialsAction {
    type: typeof SET_SOCIALS,
    payload: Array<ISocial>
}

export type SocialsActionsType = ISetSocialsAction | AnyAction;

export {
    SET_SOCIALS
}
