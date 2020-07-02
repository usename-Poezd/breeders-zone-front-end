import {applyMiddleware, combineReducers, createStore} from "redux";
import {createWrapper, Context} from "next-redux-wrapper"
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

export const initStore = (context) => {
    const initialState = {};
    if (context.asPath) {
        initialState.router = initialRouterState(context.asPath);
    }



    return createStore(
        createRootReducer(),
        initialState,
        bindMiddleware([thunkMiddleware, routerMiddleware])
    )
};

const wrapper = createWrapper(initStore);

export default wrapper;