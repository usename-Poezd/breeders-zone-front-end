import React from "react";
import {setCountries} from "../redux/Countries";
import {setAgreeDocuments} from "../redux/Documents";
import {wrapper} from "../redux/store";
import {DataService} from "../services";
import * as Cookie from "es-cookie";
import {Registration} from "../Registration";


export default () => <Registration/>;

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    const {store, req} = await ctx;
    if (Cookie.parse(String(ctx.req?.headers.cookie)).token && ctx.req) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }

    if(store.getState().countries.all.length === 0 && req) {
        const dataService = await new DataService();
        const {data: countries} = await dataService.getCountries();
        store.dispatch(setCountries(countries))
    }

    if (store.getState().documents.agree.length === 0 && req) {
        const dataService = await new DataService();
        const {data: documents} = await dataService.getDocuments({only_agree: true});
        store.dispatch(setAgreeDocuments(documents))
    }
});
