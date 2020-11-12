import {IImage} from "./image";
import {IKind} from "./kind";
import {IShop} from "./shop";
import {IMorph} from "./morph";
import {ILocality} from "./locality";
import {ISubcategory} from "./subcategory";

export interface IProduct {
    id: number
    article: string|null
    user_id: number
    subcategory_id: number|null
    locality_id: number|null
    age_id: number
    is_active: boolean
    name: string
    price: Array<{
        amount: number
        currency: string
        type: 'main'|'converted'
    }>
    currency: string
    sex: boolean|null
    description: string
    cb: string
    kind_id: number
    preview: IImage
    product_images: Array<IImage>|null
    shop: IShop
    kind: IKind
    locality: ILocality
    subcategory: ISubcategory
    guards: Array<IShop>
    age: {
        id: number
    }
    morphs: Array<IMorph>|null
    reports: Array<any>|null
}
