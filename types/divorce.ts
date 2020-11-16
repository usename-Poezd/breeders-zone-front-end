import {IShop} from "./shop";
import {IMorph} from "./morph";
import {IImage} from "./image";
import {IKind} from "./kind";

export interface IDivorce {
    id: number
    title: string
    cb: string
    shop: IShop
    male: Array<IMorph>
    female: Array<IMorph>
    sex_photos: Array<IImage>
    masonry_photos: Array<IImage>
    exit_photos: Array<IImage>
    kind: IKind
}
