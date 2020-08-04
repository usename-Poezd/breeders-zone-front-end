import initialState from "./initialState";

const product = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.product;
    }

    switch (action.type) {
        case 'PRODUCT_UPDATE_REQUEST':
            return {
                ...state,
                updateRequest: true,
                success: null,
                error: {
                    errors: null,
                    status: null
                }
            };
        case 'SET_GET_PRODUCT_REQUEST':
            return {
                ...state,
                getRequest: true,
            };
        case 'CLEAR_GET_PRODUCT_REQUEST':
            return {
                ...state,
                getRequest: false,
            };
        case 'PRODUCT_UPDATE_SUCCESS':
            state.acceptedFiles.splice(0, state.acceptedFiles.length);
            state.previews.splice(0, state.previews.length);
            return {
                ...state,
                updateRequest: false,
                success: payload,
                acceptedFiles: state.acceptedFiles,
                previews: state.previews,
                error: {
                    errors: null,
                    status: null
                }
            };
        case 'PRODUCT_UPDATE_ERROR':
            state.acceptedFiles.splice(0, state.acceptedFiles.length);
            state.previews.splice(0, state.previews.length);
            return {
                ...state,
                ...payload.product,
                updateRequest: false,
                acceptedFiles: state.acceptedFiles,
                previews: state.previews,
                success: null,
                error: payload
            };
        case 'PRODUCT_CLEAR':
            return {
                ...initialState.product,
                success: state.success,
                error: state.error,
                acceptedFiles: [],
                previews: []
            };
        case 'PRODUCT_CLEAR_SUCCESS':
            return {
                ...state,
                success: null
            };
        case 'PRODUCT_CLEAR_ERROR':
            return {
                ...state,
                error: {
                    errors: null,
                    status: null
                }
            };
        case 'SET_PRODUCT_CB':
            return {
                ...state,
                info: {
                    ...state.info,
                    cb: payload
                }
            };
        case 'SET_PRODUCT_ACCEPTED_FILES':
            return {
                ...state,
                acceptedFiles: [...state.acceptedFiles, ...payload.acceptedFiles],
                previews: [...state.previews, ...payload.previews],
            };
        case 'DELETE_PRODUCT_ACCEPTED_FILE':
            const acceptedFiles = state.acceptedFiles;
            const previews = state.previews;
            acceptedFiles.splice(payload, 1);
            previews.splice(payload, 1);
            return {
                ...state,
                acceptedFiles: [...acceptedFiles],
                previews: [...previews]
            };
        case 'SET_PRODUCT_INFO':
            return {
                ...state,
                ...payload
            };
        case 'DELETE_PRODUCT_IMG':
            const product_images = state.product_images;
            const deleteImage = product_images[payload];
            product_images.splice(payload, 1);
            return {
                ...state,
                product_images: [...product_images],
                deletedImages: [...state.deletedImages, deleteImage]
            };
        case 'SET_PRODUCT_SEARCH_RESULT':
            return {
                ...state,
                searchResult: payload
            };
        case 'SET_PRODUCT_SEARCH_REQUEST':
            return {
                ...state,
                searchRequest: payload
            };
        case 'CLEAR_SEARCH_RESULT':
            return {
                ...state,
                searchResult: []
            };
        case 'SET_SELECTED_MORPHS':
            return {
                ...state,
                selectedMorphs: [...state.selectedMorphs, payload]
            };
        case 'DELETE_SELECTED_MORPH':
            const selectedMorphs = state.selectedMorphs;
            selectedMorphs.splice(payload.idx, 1);
            return {
                ...state,
                selectedMorphs: selectedMorphs
            };
        case 'DELETE_MORPHS_KIND':
            return {
                ...state,
                deletedMorphsKind: state.selectedMorphs,
                selectedMorphs: []
            };
        case 'CLEAR_DELETED_MORPHS_KIND':
            const deletedMorphsKind = state.deletedMorphsKind;
            return {
                ...state,
                deletedMorphsKind: [],
                selectedMorphs: deletedMorphsKind
            };
        case 'DELETE_PRODUCT_REPORT':
            return {
                ...state,
                info: {
                    ...state.info,
                    reports: [...payload]
                }
            };
        default:
            return state;
    }
};

export default product;
