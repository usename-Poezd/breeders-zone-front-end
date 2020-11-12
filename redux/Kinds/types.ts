import {IKind} from "../../types";
import {AnyAction} from "redux";
const SET_KINDS = 'SET_KINDS';
const SET_ACTIVE_KIND = 'SET_ACTIVE_KIND';

export interface ISetKindsAction {
    type: typeof SET_KINDS,
    payload: {
        kinds: Array<IKind>,
        activeKinds: Array<IKind>
    }
}

export interface ISetActiveKindAction {
    type: typeof SET_ACTIVE_KIND,
    payload: IKind
}

export interface IKindsState {
    all: Array<IKind>,
    active: Array<IKind>,
    activeKind: IKind
}

export type KindsActionsType = ISetKindsAction | ISetActiveKindAction | AnyAction

export {
    SET_KINDS,
    SET_ACTIVE_KIND
}
