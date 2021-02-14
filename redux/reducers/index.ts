import initialState from "./initialState";
import resetPassword from "./reset-password";
import product from "./product";
import {kindsReducer} from "../Kinds";
import divorce from "./divorce";
import {combineReducers} from "redux";
import {routerReducer} from "connected-next-router";
import modals from "./modals";
import {currenciesReducer} from "../Currencies";
import {socialsReducer} from "../Socials";
import {authReducer} from "../Auth";
import {documentReducer} from "../Documents";
import countriesReducer from "../Countries/reducer";
import {chatReducer} from "../Chat";
import {profileReducer} from "../Profile";
import {searchReducer} from "../Search";
import {shopReducer} from "../Shop";
const createRootReducer = () => combineReducers({
    currencies: currenciesReducer,
    socials: socialsReducer,
    modals,
    auth: authReducer,
    resetPassword,
    profile: profileReducer,
    shop: shopReducer,
    product,
    divorce,
    chat: chatReducer,
    kinds: kindsReducer,
    search: searchReducer,
    countries: countriesReducer,
    documents: documentReducer,
    router: routerReducer
});

export default createRootReducer;

export {
    initialState
}
