import {DataService} from "../services";

const dataService = new DataService();

export const getKinds = () => (dispatch) => {
    dataService.getKinds()
        .then(data => dispatch(setKinds(data)));
};

export const setKinds = (payload) => {
    return {
        type: 'SET_KINDS',
        payload
    }
};

export const setActiveKind = (payload) => {
    return {
        type: 'SET_ACTIVE_KIND',
        payload
    }
};