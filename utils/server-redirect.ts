import {NextPageContext} from "next";
import * as Cookie from "es-cookie";

const serverRedirect = (ctx: NextPageContext) => {
    if (!Cookie.parse(ctx.req.headers.cookie).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }
};

export default serverRedirect;
