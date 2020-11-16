import {setChatAct} from "../../redux/Chat";
import {ILocality, IProduct, ISelectedMorph, ISubcategory} from "../../types";

export interface IProductListProps {
    products: Array<IProduct>
    meta?: {
        current_page: number,
        last_page: number
        from: number
        to: number
        per_page: number
        total: number
        selected_morphs: Array<ISelectedMorph>
        selected_localities: Array<ILocality>
        selected_subcategory: ISubcategory|null
    }
    isFilter?: boolean
    hasRow?: boolean
}

export interface IProductListStateProps {
    search: string
    pathname: string
}

export interface IProductListDispatchProps {
    setChatAct: typeof setChatAct
}

export type ProductListProps = IProductListStateProps & IProductListDispatchProps & IProductListProps
