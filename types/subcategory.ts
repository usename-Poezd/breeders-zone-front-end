import {ILocality} from "./locality";

export interface ISubcategory {
    id: number,
    title: string,
    localities: Array<ILocality>
}
