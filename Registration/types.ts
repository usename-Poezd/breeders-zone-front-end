import {ICountry, IDocument} from "../types";
import {registration} from "../redux/Auth";

export interface IRegistrationDispatchProps {
    registration: typeof registration
}

export interface IRegistrationStateProps {
    isLogin: boolean
    loginRequest: boolean
    regError: {
        message: string|null
        errors: Array<any>|null
        status: number|null
    }
    documents: {
        agree: Array<IDocument>
    },
    countries: {
        all: Array<ICountry>
    }
}

export type RegistrationPropsType = IRegistrationDispatchProps & IRegistrationStateProps;
