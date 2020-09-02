import {HYDRATE} from "next-redux-wrapper";



export interface IStatsState {
    isMobile: boolean
}

export type IStatsAction = {
    type: 'SET_IS_MOBILE'|typeof HYDRATE,
    payload: any
}


