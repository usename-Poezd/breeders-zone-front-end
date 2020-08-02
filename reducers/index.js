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
import modals from "./modals";
import countries from "./countries";
import documents from "./documents";

const createRootReducer = () => combineReducers({
    modals,
    auth,
    resetPassword,
    profile,
    shop,
    product,
    divorce,
    chat,
    kinds,
    search,
    countries,
    documents,
    router: routerReducer
});

export default createRootReducer;
