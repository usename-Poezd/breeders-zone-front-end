import {setActiveKind} from "../../../redux/Kinds";
import {IShop} from "../../../types";

export interface IShopDispatchProps {
    setActiveKind: typeof setActiveKind
}

export interface IShopProps {
    shop: IShop
    statusCode: number
}

export type ShopPropsType = IShopProps & IShopDispatchProps;
