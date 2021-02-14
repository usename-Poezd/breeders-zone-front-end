import {applyMiddleware, createStore, Store} from "redux";
import {createWrapper, MakeStore} from "next-redux-wrapper"
import thunkMiddleware from "redux-thunk";
import {createRouterMiddleware, initialRouterState} from "connected-next-router";
import Router from 'next/router'
import createSagaMiddleware from 'redux-saga'
import createRootReducer from "../reducers";
import {authWatcher} from "../Auth";
import {IRootState, SagaStore} from "./types";
import {searchWatcher} from "../Search";
import {AppContextType} from "next/dist/next-server/lib/utils";

const bindMiddleware = (middleware: Array<any>) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
};



export const initStore: MakeStore<IRootState> = (context) => {
    const routerMiddleware = createRouterMiddleware();
    const sagaMiddleware = createSagaMiddleware();

    const { asPath } = (context as AppContextType).ctx || Router.router || {};


    let initialState;
    if (asPath) {
        initialState = {
        router: initialRouterState(asPath, asPath)
        }
    }

    const store: Store = createStore(
        createRootReducer(),
        initialState,
        bindMiddleware([thunkMiddleware, routerMiddleware, sagaMiddleware])
    );

    (store as SagaStore).sagaTask = sagaMiddleware.run(authWatcher);
    (store as SagaStore).sagaTask = sagaMiddleware.run(searchWatcher);

    return store;
};

const wrapper = createWrapper<IRootState>(initStore);

export {
    wrapper
};
