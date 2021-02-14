import React, {FC, useEffect} from "react";
import Head from 'next/head'
import "../sass/app.scss";
import 'react-day-picker/lib/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {DataService} from "../services";
import { fab } from '@fortawesome/free-brands-svg-icons'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {ConnectedRouter} from "connected-next-router";
import {Header} from "../components/Header";
import SecondHeader from "../components/second-header";
import {Router} from "next/router";
// import CookiesBanner from "../components/cookies-banner/cookies-banner";
// import VerifyEmailBanner from "../components/verify-email-banner/verify-email-banner";
// import UserActivityBanner from "../components/user-activity-banner";
import Echo from "laravel-echo";
import {IRootState, wrapper} from "../redux/store";
import withYM from "next-ym";
import Footer from "../components/Footer";
import NextNProgress from "../components/progress-bar";
import {AppProps} from "next/app";
import {DataServiceProvider} from "../contexts/DataServiceConext";
import {AuthProvider} from "../contexts/AuthContext";
import {useDataService} from "../hooks";
import {useDispatch, useStore} from "react-redux";
import {setKinds} from "../redux/Kinds";
library.add(fab);
config.autoAddCss = false;

declare global {
    interface Window {
        Echo: Echo,
        io: any
    }
}

const excludeSecondHeader = [
    '/products',
    '/profile/shop',
    '/profile',
    '/login',
    '/registration'
];

const MyApp: FC<AppProps> = (props) => {
    const { Component, pageProps, router } = props;
    const dataService = useDataService();
    const {kinds}: IRootState = useStore().getState();
    const dispatch = useDispatch();
    useEffect(() => {
        if (kinds.all.length === 0) {
            dataService.getKinds()
                .then(({data}) => {
                    dispatch(setKinds(data))
                })
        }
    });

    return (
        <ConnectedRouter>
            <DataServiceProvider value={new DataService()}>
                <AuthProvider>
                    <Head>
                        <title>Breeders-zone</title>
                        <meta charSet="utf-8"/>
                        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1"/>
                        <link rel="shortcut icon" href="https://breeders-zone.s3.us-east-2.amazonaws.com/static/icons/favicon.ico" type="image/x-icon" />
                        <link
                            rel="stylesheet"
                            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                            crossOrigin="anonymous"
                        />
                        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                    </Head>

                    {/*<CookiesBanner/>*/}
                    {/*<VerifyEmailBanner/>*/}
                    {/*<UserActivityBanner/>*/}

                    <NextNProgress />
                    <Header/>
                    {
                         !excludeSecondHeader.find(item => item === router.pathname) &&
                            <SecondHeader/>
                    }
                    <Component {...pageProps}/>
                    {
                        router.pathname !== '/document'
                        && router.pathname !== '/document/[label]' ?
                            <Footer/>
                            : null
                    }
                </AuthProvider>
            </DataServiceProvider>
        </ConnectedRouter>
    );
};

export default wrapper.withRedux(
    withYM(
        process.env.NEXT_PUBLIC_YM_ACCOUNT,
        Router
    )(
        MyApp
    )
);
