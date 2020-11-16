import {ApiSuccessReturnType, IKind, IShop} from "../../../types";

export interface IShopsProps {
    shops: ApiSuccessReturnType<Array<IShop>>
}

export interface IShopsStateProps {
    search: string
    pathname: string
    activeKind: IKind|null
}

export type ShopsPropsType = IShopsProps & IShopsStateProps;
