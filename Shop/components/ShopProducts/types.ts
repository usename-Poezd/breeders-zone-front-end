import {ApiSuccessReturnType, IKind, IProduct, IUser} from "../../../types";
import {clearShopProducts, setShopProductsRequest} from "../../../redux/Shop";

export interface IShopProductsStateProps {
    isLogin: boolean
    loginRequest: boolean
    user: IUser
    products: ApiSuccessReturnType<Array<IProduct>>
    productsRequest: boolean
    allKinds: Array<IKind>
    search: string
}

export interface IShopProductsDispatchProps {
    setShopProductsRequest: typeof setShopProductsRequest
    clearShopProducts: typeof clearShopProducts
}

export type ShopProductsPropsType = IShopProductsStateProps & IShopProductsDispatchProps;
