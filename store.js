import { format } from 'url'
import {applyMiddleware, createStore} from "redux";
import {createWrapper} from "next-redux-wrapper"
import thunkMiddleware from "redux-thunk";
import createRootReducer from "./reducers";
import {createRouterMiddleware, initialRouterState} from "connected-next-router";
import Router from 'next/router'

const bindMiddleware = middleware => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
};

export const initStore = (context) => {
    const routerMiddleware = createRouterMiddleware();
    const { asPath, pathname, query } = context.ctx || Router.router || {};
    let initialState;
    if (asPath) {
        initialState = {
        router: initialRouterState(asPath, asPath)
        }
    }

    return createStore(
        createRootReducer(),
        initialState,
        bindMiddleware([thunkMiddleware, routerMiddleware])
    )
};

const wrapper = createWrapper(initStore);

export default wrapper;