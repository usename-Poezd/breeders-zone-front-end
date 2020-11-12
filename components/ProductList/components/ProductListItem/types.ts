import {IProduct, IShop, IUser} from "../../../../types";
import {setReportModalProductId, setReportModalShow} from "../../../../redux/actions";
import {setChatProduct} from "../../../../redux/Chat";

export interface IProductListItemProps {
    sendMessage: (user: IUser|IShop) => void
}

export interface IProductListItemStateProps {
    user: IUser
}

export interface IProductListItemDispatchProps {
    setReportModalProductId: typeof setReportModalProductId
    setReportModalShow: typeof setReportModalShow
    setChatProduct: typeof setChatProduct
}

export type ProductListItemPropsType = IProduct & IProductListItemProps & IProductListItemDispatchProps & IProductListItemStateProps;
