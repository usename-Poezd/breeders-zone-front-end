import {IUser} from "../../types";
import {logout} from "../../redux/Auth";
import {clearUserNotificationsCount} from "../../redux/Profile";
import {ISearchState, setSearchQuery, search} from "../../redux/Search";

export interface IHeaderStateProps {
    isLogin: boolean
    loginRequest: boolean
    user: IUser
    rooms_with_new_messages: number
    search: ISearchState
}

export interface IHeaderDispatchProps {
    logout: typeof logout
    clearUserNotificationsCount: typeof clearUserNotificationsCount
    setSearchQuery: typeof setSearchQuery
    searchAction: typeof search
}

export type HeaderPropsType = IHeaderStateProps & IHeaderDispatchProps;
