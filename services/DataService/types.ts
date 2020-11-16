import {ApiSuccessReturnType, ICountry, IDocument, IMorph, IUser} from "../../types";
//Login

export type PostLoginDataType = {
    email: string,
    password: string
}

export interface IPostLoginReturn {
    user: IUser
    access_token: string
    token_type: string
    expires_in: number
}

export type PostLoginReturnType = ApiSuccessReturnType<IPostLoginReturn>;

//Get User

export type GetUserReturnType = ApiSuccessReturnType<IUser>;



//Get Countries
export type GetCountriesReturnType = ApiSuccessReturnType<Array<ICountry>>;

//Get Documents
export type GetDocumentsDataType = {
    only_agree: boolean
}

export type GetDocumentsReturnType = ApiSuccessReturnType<Array<IDocument>>;

//Search Morphs
export type SearchMorphsReturnType = ApiSuccessReturnType<Array<IMorph>>;
