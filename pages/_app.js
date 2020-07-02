import React, {Component} from "react";
import Head from 'next/head'
import {connect, Provider} from "react-redux";
import "../sass/app.scss";
import 'react-day-picker/lib/style.css';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import Axios from "axios";
import {
    getUser, getUserData, loginSuccess, setActiveKind,
    setKinds, setRoomsCountWithNewMessages,
} from "../actions";
import {GetDataProvider} from "../components/data-service-context";
import {DataService} from "../services";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Echo from "laravel-echo";
import {Cookies, CookiesProvider} from 'react-cookie';
import {ConnectedRouter} from "connected-next-router";
import Header from "../components/header/header";
import SecondHeader from "../components/second-header";
import {Router} from "next/router";
import {Container} from "react-bootstrap";
import nextCookies from "next-cookies";
import Spinner from "../components/spinner";
import CookiesBanner from "../components/cookies-banner/cookies-banner";
import VerifyEmailBanner from "../components/verify-email-banner/verify-email-banner";
import UserActivityBanner from "../components/user-activity-banner";
import wrapper from "../store";
config.autoAddCss = false;
const dataService = new DataService();
const cookies = new Cookies();

class MyApp extends Component {

    state = {
        changeRoute: false,
        prevUrl: '',
        isSecondHeader: this.props.isSecondHeader
    };

    static async getInitialProps({Component, ctx}) {
        const state = await ctx.store.getState();
        const regExp = /(\/profile|\/guard|\/guards|\/login|\/registration|\/products|\/divorces|\/chat|\/verify|\/reset)/gi;
        let deleteToken = false;

        if (state.kinds.all.length === 0 && state.kinds.active.length === 0) {
            const kinds = await Axios.get(
                'http://nginx-web/api/kinds',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    }
                }
            )
                .then((resp) => resp.data);

            ctx.store.dispatch(setKinds(kinds));
        }


        if (ctx.query.kind) {
            const state = await ctx.store.getState();
            const regExp = await new RegExp(ctx.query.kind.replace('-', ' '), 'gi');
            const activeKind = await state.kinds.all.find((item) => item.title_eng.match(regExp));
            if (activeKind)
                ctx.store.dispatch(setActiveKind(activeKind));
        } else if (ctx.query.kindId) {
            const state = await ctx.store.getState();
            const activeKind = await state.kinds.all.find((item) => item.id === Number(ctx.query.kindId));
            if (activeKind)
                ctx.store.dispatch(setActiveKind(activeKind));
        } else {
            //clear active kind
            ctx.store.dispatch(setActiveKind({
                title_rus: '',
                title_eng: ''
            }));
        }
        if (nextCookies(ctx).token && !state.profile.user.id) {
            try {
                const data = await dataService.getUserData(nextCookies(ctx).token);
                ctx.store.dispatch(getUserData(data));

                ctx.store.dispatch(setRoomsCountWithNewMessages(data.roomsWithNewMessages));
                ctx.store.dispatch(loginSuccess());
            } catch (e) {
                deleteToken = true
            }
        }

        return {deleteToken, isSecondHeader: ctx.pathname.match(regExp) === null};
    }

    componentDidMount() {
        const {deleteToken} = this.props
        const regExp = /(\/profile|\/guard|\/guards|\/login|\/registration|\/products|\/divorces|\/chat|\/verify|\/reset)/gi;

        if (deleteToken) {
            cookies.set('token', '');
        }

        window.qs = require('qs');
        window.io = require('socket.io-client');
        window.Echo = new Echo({
            broadcaster: 'socket.io',
            wsHost:  window.location.hostname,
            wsPort: 6001,
            disableStats: false,
            auth: {
                headers: {
                    Authorization: 'Bearer ' + cookies.get('token')
                }
            }
        });

        this.setState({prevUrl: Router.asPath});

        Router.events.on('routeChangeStart', (url) => {
            const {prevUrl} = this.state;
            let regPrevUrl = null;

            const regUrl = url.match(/(((\/\w+)*\/)([\w\-\.]+[^#?\s]+))(.+)?(#[\w\-]+)?$/);
            if (prevUrl)
                regPrevUrl = prevUrl.match(/(((\/\w+)*\/)([\w\-\.]+[^#?\s]+))(.+)?(#[\w\-]+)?$/);

            if (url.match(/\/(divorces|products)\/edit\/\d$/) === null) { //TODO:refactor that
                if (regUrl !== null && regPrevUrl !== null ) {
                    if (url !== prevUrl && ( regUrl[1] !== regPrevUrl[1]))
                        this.setState({changeRoute: true});
                } else {
                    this.setState({changeRoute: true});
                }
            }


            if (url.match(regExp) === null)
                this.setState({isSecondHeader: true});
            else
                this.setState({isSecondHeader: false});

            this.setState({prevUrl: url})
        });
        Router.events.on('routeChangeComplete', () => this.setState({changeRoute: false}));
    }

    render() {
        const { changeRoute, isSecondHeader } = this.state;
        const { Component, pageProps, deleteToken } = this.props;

        return (
                    <CookiesProvider>
                        <ConnectedRouter>
                            <GetDataProvider value={dataService}>
                                <Head>
                                    <title>Breeders-zone</title>
                                    <meta charSet="utf-8"/>
                                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                                    <link
                                        rel="stylesheet"
                                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                                        crossOrigin="anonymous"
                                    />
                                    <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                                    <script src="https://kit.fontawesome.com/438eed2481.js" crossOrigin="anonymous"></script>
                                </Head>

                                <CookiesBanner/>
                                <VerifyEmailBanner/>
                                <UserActivityBanner/>

                            <Header deleteToken={deleteToken}/>
                            {
                                isSecondHeader ?
                                    <SecondHeader/>
                                    : null
                            }
                            {
                                changeRoute ?
                                    (
                                        <Container>
                                            <Spinner/>
                                        </Container>
                                    )
                                    : <Component {...pageProps}/>
                            }

                            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
                                    integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
                                    crossOrigin="anonymous"></script>
                            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
                                    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
                                    crossOrigin="anonymous"></script>
                            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
                                    integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
                                    crossOrigin="anonymous"></script>
                        </GetDataProvider>
                    </ConnectedRouter>
                </CookiesProvider>
        )
    }
}

export default wrapper.withRedux(MyApp);