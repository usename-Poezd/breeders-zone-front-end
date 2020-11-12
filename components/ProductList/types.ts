import {setChatAct} from "../../redux/Chat";
import {GetProductsDataType} from "../../types";

export interface IProductListProps {
    products: GetProductsDataType
}

export interface IProductListStateProps {
    search: string
    pathname: string
}

export interface IProductListDispatchProps {
    setChatAct: typeof setChatAct
}

export type ProductListProps = IProductListStateProps & IProductListDispatchProps & IProductListProps
