import {NextPageContext} from "next";
import * as Cookie from "es-cookie";
import {GetServerSidePropsContext} from "next-redux-wrapper";
import {AnyAction, Store} from "redux";
import {IRootState} from "../redux/store";
import {setIsLogin} from "../redux/Auth";

const serverRedirect = (ctx: NextPageContext|GetServerSidePropsContext & {
    store: Store<IRootState, AnyAction>;
}) => {
    if (!Cookie.parse(String(ctx.req?.headers.cookie)).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }

    if (ctx.store) {
        ctx.store.dispatch(setIsLogin(true));
    }
};

export default serverRedirect;
