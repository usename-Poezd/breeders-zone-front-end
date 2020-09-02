import {HYDRATE} from "next-redux-wrapper";



export interface IStatsState {
    isMobile: boolean
}

interface IHydrate {
    stats: {}
}

export type IStatsAction = {
    type: 'SET_IS_MOBILE'|typeof HYDRATE,
    payload: IHydrate|boolean
}


