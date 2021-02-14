import {IUser} from "../../../types";
import {
    setShopUpdateError,
    setShopUpdateSuccess,
    shopUpdateClear
} from "../../../redux/Shop";
import {IShopState} from "../../../redux/Shop";
import {ICountriesState} from "../../../redux/Countries";
import {setUser} from "../../../redux/Auth";

export interface IInitialValues {
    logo_img_url: string
    company_name: string
    owner: string
    country: string
    phone: string
    local_delivery: boolean
    regional_delivery: boolean
    countrywide_delivery: boolean
    description: string
    policity: string
    website: string
    vk: string
    location: string
    instagram: string
    facebook: string
    youtube: string
}

export interface IShopProfileStateProps {
    user: IUser|null
    shop: IShopState
    isLogin: boolean
    countries: ICountriesState
    loginRequest: boolean
}

export interface IShopProfileDispatchProps {
    setShopUpdateSuccess: typeof setShopUpdateSuccess
    shopUpdateClear: typeof shopUpdateClear
    setShopUpdateError: typeof setShopUpdateError
    setUser: typeof setUser
}

export type ShopProfilePropsType = IShopProfileStateProps & IShopProfileDispatchProps
