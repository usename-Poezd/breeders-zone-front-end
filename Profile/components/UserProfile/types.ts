import {IUser} from "../../../types";
import {IProfileState, setProfileUpdateError, setProfileUpdateSuccess} from "../../../redux/Profile";
import {logout, setUser} from "../../../redux/Auth";

export interface IInitialsValues {
    name: string
    surname: string
    patronymic: string
    about: string
    email: string
    password: string
    profile_img?: File
    profile_imgPreviews: Array<string>
    old_password: string
    password_confirmation: string
}
export interface IUserProfileStateProps {
    user: IUser|null
    loginRequest: boolean
    isLogin: boolean
    profile: IProfileState
}

export interface IUserProfileDispatchProps {
    setProfileUpdateSuccess: typeof setProfileUpdateSuccess
    setProfileUpdateError: typeof setProfileUpdateError
    setUser: typeof setUser
    logout: typeof logout
}

export type UserProfilePropsType  = IUserProfileStateProps & IUserProfileDispatchProps
