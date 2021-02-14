import {GetServerSidePropsContext} from "next-redux-wrapper";
import {AnyAction, Store} from "redux";
import {IRootState} from "../redux/store";
import {DataService} from "../services/DataService";
import {setActiveKind, setKinds} from "../redux/Kinds";
import toUrl from "./to-url";

const serverSetKinds = async (ctx: GetServerSidePropsContext & {
    store: Store<IRootState, AnyAction>;
}, isActiveKind: boolean = false) => {
    const state = await ctx.store.getState();
    const dataService = new DataService();
    if (ctx.req && state.kinds.all.length === 0) {
        const {data} = await dataService.getKinds();
        ctx.store.dispatch(setKinds(data))
    }

    if (isActiveKind && ctx.query.kind) {
        const {kinds: {all: kinds}} = await ctx.store.getState();

        const kind = kinds.find((item) => toUrl(item.title_eng) === toUrl(String(ctx.query.kind)));

        if (kind) {
            ctx.store.dispatch(setActiveKind(kind))
        }

    }
};

export {
    serverSetKinds
};
