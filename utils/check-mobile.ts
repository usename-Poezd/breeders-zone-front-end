import {NextPageContext} from "next";

const checkMobile = (ctx?: NextPageContext): boolean => {
    const isMobileView = (ctx.req
        ? ctx.req.headers['user-agent']
        : navigator.userAgent).match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    );

    return Boolean(isMobileView);
};

export default checkMobile;
