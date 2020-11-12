import * as Cookie from "es-cookie";
import {NextPageContext} from "next";

const isLogin = (ctx: NextPageContext = null) => {
    return ctx ? !!Cookie.parse(ctx.req.headers.cookie).token : !!Cookie.get('token')
};

export default isLogin;
