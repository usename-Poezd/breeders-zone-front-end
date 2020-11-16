import {NextPageContext} from "next";

const checkMobile = (ctx?: NextPageContext): boolean => {
    let agent: string|null = null;

    if (ctx) {
        agent = ctx.req.headers['user-agent'];
    }

    if (typeof window !== 'undefined') {
        agent = navigator.userAgent;
    }


    if (agent !== null) {
        const isMobileView = agent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);
        return Boolean(isMobileView);
    }

    return false
};

export default checkMobile;
