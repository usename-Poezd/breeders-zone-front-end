import {ICountry, IDocument, IMorph, IUser} from "../../types";
import {Store} from "redux";
import {Task} from "redux-saga";

export interface IApiSuccessReturn {
    ok: boolean
    message?: string
    meta: {
        current_page: number,
        last_page: number
        from: number
        to: number
        per_page: number
        total: number
        selected_morphs?: Array<any>
        selected_localities?: Array<any>
        selected_subcategory?: Array<any>
    }

}

//Login

export type PostLoginDataType = {
    email: string,
    password: string
}

export interface IPostLoginReturn {
    data: {
        user: IUser
        access_token: string
        token_type: string
        expires_in: number
    }
}

export type PostLoginReturnType = IApiSuccessReturn & IPostLoginReturn

//Get User

export interface IGetUserReturn {
    data: IUser
}

export type GetUserReturnType = IApiSuccessReturn & IGetUserReturn;



//Get Countries
export interface IGetCountriesReturn {
    data: Array<ICountry>
}

export type GetCountriesReturnType = IApiSuccessReturn & IGetCountriesReturn;

//Get Documents
export type GetDocumentsDataType = {
    only_agree: boolean
}


export interface IGetDocumentsReturn {
    data: Array<IDocument>
}
export type GetDocumentsReturnType = IApiSuccessReturn & IGetDocumentsReturn;

//Search Morphs
export interface ISearchMorphsReturn {
    data: Array<IMorph>
}
export type SearchMorphsReturnType = ISearchMorphsReturn & IApiSuccessReturn;
