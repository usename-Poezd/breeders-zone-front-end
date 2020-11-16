import {IGene, IKind, ISubcategory} from "../types";

export interface IMorphsProps {
    morphs: {
        genes: Array<IGene & {
            traits: Array<{
                title: string
                label?: string
                type: string
                products_count: number
            }>
        }>
        subcategories: Array<ISubcategory & {
            products_count: number
        }>
    }
}

export interface IMorphsStateProps {
    activeKinds: Array<IKind>
    activeKind: IKind|null
}

export type MorphsPropsType = IMorphsProps & IMorphsStateProps;
