import initialState from "./initialState";
import auth from "./auth";
import resetPassword from "./reset-password";
import profile from "./profile";
import shop from "./shop";
import product from "./product";
import chat from "./chat";
import kinds from "./kinds";
import search from "./search";
import divorce from "./divorce";
import {combineReducers} from "redux";
import {routerReducer} from "connected-next-router";

const createRootReducer = () => combineReducers({
    auth: auth,
    resetPassword: resetPassword,
    profile: profile,
    shop: shop,
    product: product,
    divorce: divorce,
    chat: chat,
    kinds: kinds,
    search: search,
    router: routerReducer
});

export default createRootReducer;