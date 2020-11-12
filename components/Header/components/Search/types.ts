import {IKind, IMorph} from "../../../../types";
import {search} from "../../../../redux/Search";

export interface ISearchFormInitialValues {
    kind: string
    subcategory: string|null
    locality: string|null
    sex: string
    age: string
    morphs_min: string
    morphs_max: string
    price_min: string
    price_max: string
    morphs_in: Array<IMorph>
    morphs_out: Array<IMorph>
}

interface ISearchProps {
    isToggle: boolean
    onToggleBurger: () => void
}

export interface ISearchStateProps {
    allKinds: Array<IKind>
}

export interface ISearchDispatchProps {
    search: typeof search;
}

export type SearchPropsType = ISearchProps & ISearchStateProps & ISearchDispatchProps
