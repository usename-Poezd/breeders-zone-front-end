import {IKind} from "./kind";
import {ILevel} from "./level";
import {ICountry} from "./country";

export interface IUser {
    id: number,
    name: string
    surname: string
    patronymic: string,
    notifications: Array<any>
    rooms_with_new_messages: number
    unread_notifications_count: number
    email: string
    phone: string
    email_verified_at: string
    is_breeder: boolean
    active: boolean
    breeder_level: ILevel
    company_name: string
    logo_img_url: string
    owner: string
    location: string
    description: string
    profile_img: string|null
    about: string
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
    guard_level: ILevel
    guardians_kinds: Array<IKind>
    guard_XP: number
    breeder_XP: number
    country: ICountry
}
