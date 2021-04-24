import {DefaultSeoProps} from "next-seo";

export const setSeo = (payload: DefaultSeoProps) => {
    return {
        type: 'SET_SEO',
        payload
    }
};
