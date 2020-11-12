import {IKindsState} from "../Kinds";
import {ICurrenciesState} from "../Currencies";
import {ISocialsState} from "../Socials";
import {IAuthState} from "../Auth";
import {Store} from "redux";
import {Task} from "redux-saga";
import {ICountriesState} from "../Countries";
import {IDocumentsState} from "../Documents";
import {IChatState} from "../Chat";
import {IProfileState} from "../Profile";
import {ISearchState} from "../Search";
import {RouterState} from "connected-next-router/types";

export interface IRootState {
    kinds: IKindsState
    currencies: ICurrenciesState
    socials: ISocialsState
    auth: IAuthState
    countries: ICountriesState
    documents: IDocumentsState
    chat: IChatState
    profile: IProfileState
    search: ISearchState
    router: RouterState
}

export interface SagaStore extends Store {
    sagaTask?: Task;
}
