import {IStatsAction, IStatsState} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";

const initialState: IStatsState = {
   isMobile: false
};

const stats = (state = initialState, action: IStatsAction) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, payload.stats);
            const wasBumpedOnClient = stateDiff?.isMobile?.[0] === true;
            return {
                ...state,
                ...payload.stats,
                isMobile: wasBumpedOnClient ? state.isMobile : action.payload.stats.isMobile
            };
        case "SET_IS_MOBILE":
             return  {
                ...state,
                isMobile: payload
            };
        default:
            return state
    }
};

export default stats;
