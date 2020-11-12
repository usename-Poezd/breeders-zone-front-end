import { login } from "../redux/Auth";

export interface ILoginDispatchProps {
    login: typeof login
}

export interface ILoginStateProps {
    isLogin: boolean
    loginRequest: boolean
    loginError: {
        message: string|null
        errors: Array<any>|null
        status: number|null
    }
}

export interface ILoginFormInitialValues {
    email: string,
    password: string
}

export type LoginPropsType = ILoginDispatchProps & ILoginStateProps;
