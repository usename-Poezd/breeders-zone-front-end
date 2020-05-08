import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import createRootReducer from "./reducers";
import {createRouterMiddleware, initialRouterState} from "connected-next-router";

const routerMiddleware = createRouterMiddleware();

const bindMiddleware = middleware => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
};

export const initStore = (initialState = {}, options) => {
    if (options.asPath) {
        initialState.router = initialRouterState(options.asPath);
    }

    return createStore(
        createRootReducer(),
        initialState,
        bindMiddleware([thunkMiddleware, routerMiddleware])
    )
};