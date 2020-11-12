import {applyMiddleware, createStore} from "redux";
import {createWrapper} from "next-redux-wrapper"
import thunkMiddleware from "redux-thunk";
import {createRouterMiddleware, initialRouterState} from "connected-next-router";
import Router from 'next/router'
import createSagaMiddleware from 'redux-saga'
import createRootReducer from "../reducers";
import {authWatcher} from "../Auth";
import {SagaStore} from "./types";
import {searchWatcher} from "../Search";

const bindMiddleware = middleware => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
};



export const initStore = (context) => {
    const routerMiddleware = createRouterMiddleware();
    const sagaMiddleware = createSagaMiddleware();

    const { asPath } = context.ctx || Router.router || {};
    let initialState;
    if (asPath) {
        initialState = {
        router: initialRouterState(asPath, asPath)
        }
    }

    const store = createStore(
        createRootReducer(),
        initialState,
        bindMiddleware([thunkMiddleware, routerMiddleware, sagaMiddleware])
    );

    (store as SagaStore).sagaTask = sagaMiddleware.run(authWatcher);
    (store as SagaStore).sagaTask = sagaMiddleware.run(searchWatcher);

    return store;
};

const wrapper = createWrapper(initStore);

export {
    wrapper
};
