import {IKind} from "./kind";
import {ICountry} from "./country";
import {IProduct} from "./product";
import {IDivorce} from "./divorce";

export interface IShop {
    id: number,
    name: string
    surname: string
    patronymic: string
    email: string
    email_verified_at: string
    is_breeder: boolean
    active: boolean
    breeder_level: number
    company_name: string
    logo_img_url: string
    owner: string
    location: string
    description: string
    policity: string
    website: string
    vk: string
    facebook: string
    instagram: string
    youtube: string
    local_delivery: boolean
    regional_delivery: boolean
    countrywide_delivery: boolean
    is_guard: boolean
    guard_level: number
    guard_XP: number
    breeder_XP: number
    products_count?: number
    country: ICountry
    kinds?: Array<IKind>
    products?: Array<IProduct>
    divorces?: Array<IDivorce>
}
