import {IShop} from "./shop";
import {ISubcategory} from "./subcategory";
import {ILocality} from "./locality";

export interface IKind {
    id: number,
    title_eng: string,
    title_rus: string,
    group: string
    logo_square: string,
    logo_header: string,
    has_subcategories: boolean,
    guards?: Array<IShop>,
    subcategories?: Array<ISubcategory>
    localities?: Array<ILocality>
}

