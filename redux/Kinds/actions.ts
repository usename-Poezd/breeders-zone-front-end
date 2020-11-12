import {DataService} from "../../services";
import {ISetActiveKindAction, ISetKindsAction, SET_ACTIVE_KIND, SET_KINDS} from "./types";
import {IKind} from "../../types";

const dataService = new DataService();

export const getKinds = () => (dispatch) => {
    dataService.getKinds()
        .then(data => dispatch(setKinds(data)));
};

export const setKinds = (payload): ISetKindsAction => {
    return {
        type: SET_KINDS,
        payload
    }
};

export const setActiveKind = (payload: IKind): ISetActiveKindAction => {
    return {
        type: SET_ACTIVE_KIND,
        payload
    }
};
