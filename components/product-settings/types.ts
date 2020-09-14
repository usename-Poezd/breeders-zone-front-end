import {WithRouterProps} from "next/dist/client/with-router";
import {
    deleteProductStateImg,
    setProductCb,
    deleteAcceptedFile,
    setAcceptedFiles,
    setSelectedMorph,
    deleteSelectedMorph,
    clearSearchResult,
    setProductSearchResult,
    deleteMorphsKind,
    clearDeletedMorphsKind,
    setProductSearchRequest,
} from "../../actions";

export interface IStateProps {
    user: any,
    product: {
        info: {
            id: string,
            article: string,
            user_id: number|null,
            name: string,
            price: number|string,
            sex: boolean,
            cb: string,
            is_active: boolean,
            reports: Array<any>,
            description: string,
            locality_id: number|string|null,
            subcategory_id: number|string|null,
            kind_id: number|string|null,
            preview: {
                img_src: string
            }|null
        }
        product_images: Array<{
            img_src: string
        }>,
        deletedImages: Array<number>,
        acceptedFiles: Array<File>,
        previews: Array<string>,
        searchResult: Array<any>,
        searchRequest: boolean,
        selectedMorphs: Array<any>,
        deletedMorphsKind: Array<any>, //here morphs who deleted where info kindId is changed
        localities: Array<any>,
        getRequest: boolean,
        updateRequest: boolean,
        success: string|null,
        error: {
            errors: Array<any>|null,
            status: string|null
        }
    },
    allKinds,
    loginRequest
}

export interface IDispatchProps {
    deleteProductStateImg: typeof deleteProductStateImg,
    setProductCb: typeof setProductCb,
    deleteAcceptedFile: typeof deleteAcceptedFile,
    setAcceptedFiles: typeof setAcceptedFiles,
    setSelectedMorph: typeof setSelectedMorph,
    deleteSelectedMorph: typeof deleteSelectedMorph,
    clearSearchResult: typeof clearSearchResult,
    setProductSearchResult: typeof setProductSearchResult,
    deleteMorphsKind: typeof deleteMorphsKind,
    clearDeletedMorphsKind: typeof clearDeletedMorphsKind,
    setProductSearchRequest: typeof setProductSearchRequest,
}

interface IOtherProps {
    submit: (...args: any[]) => any
}

export type ProductSettingsProps = IStateProps & IDispatchProps & WithRouterProps & IOtherProps;
