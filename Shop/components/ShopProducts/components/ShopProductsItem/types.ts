import {activeShopProduct, deleteProduct} from "../../../../../redux/Shop";
import {IProduct} from "../../../../../types";

export interface IShopProductsItemDispacthProps {
    deleteProduct: typeof deleteProduct
    activeShopProduct: typeof activeShopProduct
}

export type ShopProductsItemPropsType = IProduct & IShopProductsItemDispacthProps;
