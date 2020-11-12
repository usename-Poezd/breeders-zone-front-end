import {IMorph} from "./morph";

export type MorphSearchType = IMorph & {
    type?: 'add'|'delete'
}
