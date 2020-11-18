import {ISocial} from "../../types";

export interface IFooterStateProps {
    socials: {
        all: Array<ISocial>
    }
    isLogin: boolean
}

export type FooterPropsType = IFooterStateProps;
