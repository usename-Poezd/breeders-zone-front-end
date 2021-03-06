import React, {Component} from "react";
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import {connect} from "react-redux";
import "../sass/app.scss";
import 'react-day-picker/lib/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {
    getUserData, loginSuccess, setActiveKind,
    setKinds, setRoomsCountWithNewMessages,
    receivedMessage,
    updateCheckMessage,
    addNotification, logout, setIsMobile, setCurrencies, setSeo
} from "../actions";
import {GetDataProvider} from "../components/data-service-context";
import {DataService} from "../services";
import { fab } from '@fortawesome/free-brands-svg-icons'
import { config, library, icon } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Echo from "laravel-echo";
import {ConnectedRouter} from "connected-next-router";
import Header from "../components/header/header";
import SecondHeader from "../components/second-header";
import {Router, withRouter} from "next/router";
import CookiesBanner from "../components/cookies-banner/cookies-banner";
import VerifyEmailBanner from "../components/verify-email-banner/verify-email-banner";
import UserActivityBanner from "../components/user-activity-banner";
import wrapper from "../store";
import nookies from "nookies";
import withYM from "next-ym";
import Footer from "../components/footer";
import NextNProgress from "../components/progress-bar";
import {toUrl, checkMobile, prepareSeo} from "../utils";
import {setSocials} from "../actions/socials";
import {SEO} from "../next-seo.config";
library.add(fab);
config.autoAddCss = false;
const dataService = new DataService();

class MyApp extends Component {

    state = {
        prevUrl: '',
        isSecondHeader: this.props.isSecondHeader
    };



    static async getInitialProps({ctx}) {
        const state = await ctx.store.getState();
        const regExp = /(\/profile|\/guard|\/guards|\/login|\/registration|\/products|\/divorces|\/chat|\/verify|\/reset|\/documents)/gi;

        if (ctx.req) {
            if (state.currencies.all.length === 0) {
                const currencies = await dataService.getCurrencies();

                ctx.store.dispatch(setCurrencies(currencies));
            }

            if (state.socials.all.length === 0) {
                const socials = await dataService.getSocials();

                ctx.store.dispatch(setSocials(socials));
            }

            if (state.kinds.all.length === 0 && state.kinds.active.length === 0) {
                const kinds = await dataService.getKinds();

                ctx.store.dispatch(setKinds(kinds));
            }


            if (ctx.query.kind) {
                const state = await ctx.store.getState();
                const activeKind = await state.kinds.all.find((item) => toUrl(item.title_eng) === toUrl(ctx.query.kind));
                if (activeKind)
                    ctx.store.dispatch(setActiveKind(activeKind));
            } else if (ctx.query.kindId) {
                const state = await ctx.store.getState();
                const activeKind = await state.kinds.all.find((item) => item.id === Number(ctx.query.kindId));
                if (activeKind) {
                    ctx.store.dispatch(setActiveKind(activeKind));
                }


            } else {
                ctx.store.dispatch(setActiveKind({
                    title_rus: '',
                    title_eng: ''
                }));
            }

            if (nookies.get(ctx).token && !ctx.store.getState().profile.user.id) {
                try {
                    const data = await dataService.getUserData(nookies.get(ctx).token);
                    ctx.store.dispatch(getUserData(data));

                    ctx.store.dispatch(setRoomsCountWithNewMessages(data.roomsWithNewMessages));
                    ctx.store.dispatch(loginSuccess());
                } catch (e) {
                    nookies.destroy(ctx, 'token');
                    if (e.response.status === 403) {
                        ctx.res.setHeader("location", "/verify");
                        ctx.res.statusCode = 302;
                        ctx.res.end();
                    }
                }
            }
        }

        if (ctx.pathname === '/') {
            ctx.store.dispatch(setActiveKind({
                title_rus: '',
                title_eng: ''
            }));
        }

        ctx.store.dispatch(setIsMobile(checkMobile(ctx)));

        if (typeof window !== 'undefined' && !nookies.get().token) {
            ctx.store.dispatch(logout())
        }

        if (SEO[ctx.pathname]) {
            ctx.store.dispatch(setSeo(SEO[ctx.pathname]))
        }

        switch (ctx.pathname) {
            case '/[group]/[kind]':
                ctx.store.dispatch(setSeo(prepareSeo(ctx.store.getState().kinds.activeKind.seo.kind)));
                break;
            case '/[group]/[kind]/morphs':
                ctx.store.dispatch(setSeo(prepareSeo(ctx.store.getState().kinds.activeKind.seo.kind)));
                break;
        }

        return {store: ctx.store, isLogin: ctx.store.getState().auth.isLogin, user: ctx.store.getState().profile.user, isSecondHeader: ctx.pathname.match(regExp) === null};
    }

    componentDidMount() {
        const {
            isLogin,
            user,
            receivedMessage,
            updateCheckMessage,
            addNotification,
            router
        } = this.props;
        const regExp = /(\/profile|\/guard|\/guards|\/login|\/registration|\/products|\/divorces|\/chat|\/verify|\/reset|\/documents)/gi;
        const cookies = nookies.get();

        window.qs = require('qs');
        window.io = require('socket.io-client');
        window.Echo = new Echo({
            broadcaster: 'socket.io',
            wsHost:  window.location.hostname,
            wsPort: 6001,
            disableStats: false,
            auth: {
                headers: {
                    Authorization: 'Bearer ' + cookies.token
                }
            }
        });

        if(isLogin) {
            window.Echo.private(`App.User.${user.id}`)
                .notification((notification) => {
                    switch (notification.type) {
                        case 'App\\Notifications\\NewMessageNotification':
                            receivedMessage(notification[0]);
                            break;
                        case 'App\\Notifications\\CheckMessagesNotification':
                            updateCheckMessage(notification[0]);
                            break;
                        default:
                            addNotification(notification);
                    }
                });
        }

        this.setState({prevUrl: router.asPath});
        router.events.on('routeChangeComplete', (url) => {
            if (url.match(regExp) === null)
                this.setState({isSecondHeader: true});
            else
                this.setState({isSecondHeader: false});
        });
    }

    render() {
        const { isSecondHeader } = this.state;
        const { Component, pageProps, deleteToken, router, seo } = this.props;
        return (
            <ConnectedRouter>
                <GetDataProvider value={dataService}>
                    <DefaultSeo
                        {...seo}
                        canonical={seo.canonical ? seo.canonical : `https://breederszone.com${router.asPath !== '/' ? router.asPath : ''}`.toLowerCase()}
                    />
                    <Head>
                        <meta httpEquiv="origin-trial" content="AmUOTjUx4xBjILn58BdSYRp4w+DXucr7UJxGV/HKVRZLSd6uGn5zEIS/6kIgn8aNFnRwAU6tP7QP309ckntJoQoAAAB6eyJvcmlnaW4iOiJodHRwczovL2JyZWVkZXJzem9uZS5jb206NDQzIiwiZmVhdHVyZSI6IlVucmVzdHJpY3RlZFNoYXJlZEFycmF5QnVmZmVyIiwiZXhwaXJ5IjoxNjMzNDc4Mzk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0="/>
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

                    <CookiesBanner/>
                    <VerifyEmailBanner/>
                    <UserActivityBanner/>

                    <NextNProgress />
                    <Header deleteToken={deleteToken}/>
                    {
                        isSecondHeader ?
                            <SecondHeader/>
                            : null
                    }
                   <main>
                       <Component {...pageProps}/>
                   </main>
                    {
                        router.pathname !== '/documents'
                        && router.pathname !== '/documents/[label]' ?
                            <Footer/>
                            : null
                    }
            </GetDataProvider>
        </ConnectedRouter>
        )
    }
}

export default wrapper.withRedux(
    withYM(
        process.env.NEXT_PUBLIC_YM_ACCOUNT,
        Router
    )(
        connect(({seo}) => ({seo}), {
            receivedMessage,
            updateCheckMessage,
            addNotification,
        })(
            withRouter(MyApp)
        )
    )
);
