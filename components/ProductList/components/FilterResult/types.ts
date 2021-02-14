import {ILocality, ISelectedMorph} from "../../../../types";

export type FilterPropsType = {
    total: number
    morphs: Array<ISelectedMorph>
    localities: Array<ILocality>
    changeRequest: () => void
    request: boolean
}
