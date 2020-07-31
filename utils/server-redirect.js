import nookies from "nookies";

const serverRedirect = (ctx) => {
    if (!nookies.get(ctx).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }
};

export default serverRedirect;
