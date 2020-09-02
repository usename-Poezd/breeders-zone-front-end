import {IStatsAction} from "../reducers/stats/types";

export const setIsMobile = (payload: boolean): IStatsAction => {
    return {
        type: "SET_IS_MOBILE",
        payload
    }
};
