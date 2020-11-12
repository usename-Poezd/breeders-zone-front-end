import {IProduct} from "./product";
import {ILocality} from "./locality";
import {ISubcategory} from "./subcategory";

export interface ISelectedMorph {
    trait_id: number
    gene_id: number
    gene_title: string
    trait_title: string
    type?: string
    label?: string
}

export type GetProductsDataType = {
    ok: boolean
    message?: string
    data: Array<IProduct>
    meta: {
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
}
