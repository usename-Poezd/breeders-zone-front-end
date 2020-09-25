import {IconName} from "@fortawesome/fontawesome-common-types";

export interface ISocial {
    id: number,
    title: string,
    fa_icon: IconName,
    url: string,
    created_at: string,
    updated_at: string,
}

export interface ISocialState {
    all: Array<ISocial>
}
