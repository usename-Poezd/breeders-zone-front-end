import * as Cookie from "es-cookie";
import {NextPageContext} from "next";

const isLogin = (ctx?: NextPageContext) => {
    return ctx ? !!Cookie.parse(String()).token : !!Cookie.get('token')
};

export default isLogin;
