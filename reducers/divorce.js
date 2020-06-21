import initialState from "./initialState";

const divorce = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.divorce;
    }

    switch (action.type) {
        case 'SET_DIVORCE':
            return {
                ...state,
                ...payload
            };
        case 'SET_DIVORCE_REQUEST':
            return {
                ...state,
                divorceRequest: !state.divorceRequest
            };
        case 'SET_DIVORCE_CB':
            return {
                ...state,
                cb: payload
            };
        case 'DELETE_MALE_AND_FEMALE_MORPHS':
            return {
                ...state,
                male: [],
                female: []
            };
        case 'SET_DIVORCE_SEARCH_RESULT_MALE':
            return {
                ...state,
                searchResultMale: payload
            };
        case 'SET_SEARCH_MALE_REQUEST':
            return {
                ...state,
                searchMaleRequest: payload
            };
        case 'SET_MALE_MORPHS':
            return {
                ...state,
                male: [ payload, ...state.male]
            };
        case 'CLEAR_DIVORCE_SEARCH_RESULT_MALE':
            return {
                ...state,
                searchResultMale: []
            };
        case 'DELETE_MALE_MORPH':
            state.male.splice(payload, 1);
            return {
                ...state,
                male: [...state.male]
            };
        case 'SET_DIVORCE_SEARCH_RESULT_FEMALE':
            return {
                ...state,
                searchResultFemale: payload
            };
        case 'SET_SEARCH_FEMALE_REQUEST':
            return {
                ...state,
                searchFemaleRequest: payload
            };
        case 'SET_FEMALE_MORPHS':
            return {
                ...state,
                female: [ payload, ...state.female]
            };
        case 'CLEAR_DIVORCE_SEARCH_RESULT_FEMALE':
            return {
                ...state,
                searchResultFemale: []
            };
        case 'DELETE_FEMALE_MORPH':
            state.female.splice(payload, 1);
            return {
                ...state,
                female: [...state.female]
            };
        case 'SET_ACCEPTED_FILES_SEX':
            return {
                ...state,
                acceptedFilesSex: payload.acceptedFiles,
                previewsSex: payload.previews
            };
        case 'SET_ACCEPTED_FILES_MASONRY':
            return {
                ...state,
                acceptedFilesMasonry: payload.acceptedFiles,
                previewsMasonry: payload.previews
            };
        case 'SET_ACCEPTED_FILES_EXIT':
            return {
                ...state,
                acceptedFilesExit: payload.acceptedFiles,
                previewsExit: payload.previews
            };
        case 'DELETE_ACCEPTED_FILE_SEX':
            state.acceptedFilesSex.splice(payload, 1);
            state.previewsSex.splice(payload, 1);
            return {
                ...state,
                acceptedFilesSex: [...state.acceptedFilesSex],
                previewsSex: [...state.previewsSex]
            };
        case 'DELETE_ACCEPTED_FILE_MASONRY':
            state.acceptedFilesMasonry.splice(payload, 1);
            state.previewsMasonry.splice(payload, 1);
            return {
                ...state,
                acceptedFilesMasonry: [...state.acceptedFilesMasonry],
                previewsMasonry: [...state.previewsMasonry]
            };
        case 'DELETE_ACCEPTED_FILE_EXIT':
            state.acceptedFilesExit.splice(payload, 1);
            state.previewsExit.splice(payload, 1);
            return {
                ...state,
                acceptedFilesExit: [...state.acceptedFilesExit],
                previewsExit: [...state.previewsExit]
            };
        case 'DELETE_SEX_PHOTO':
            state.sexPhotos.splice(payload, 1);
            return {
                ...state,
                sexPhotos: [...state.sexPhotos]
            };
        case 'DELETE_MASONRY_PHOTO':
            state.masonryPhotos.splice(payload, 1);
            return {
                ...state,
                masonryPhotos: [...state.masonryPhotos]
            };
        case 'DELETE_EXIT_PHOTO':
            state.exitPhotos.splice(payload, 1);
            return {
                ...state,
                exitPhotos: [...state.exitPhotos]
            };
        case 'SET_DIVORCE_SUCCESS':
            return {
                ...state,
                success: payload
            };
        case 'CLEAR_DIVORCE_SUCCESS':
            return {
                ...state,
                success: null
            };
        case 'SET_DIVORCE_ERROR':
            return {
                ...state,
                error: payload
            };
        case 'CLEAR_DIVORCE_ERROR':
            return {
                ...state,
                error: initialState.divorce.error
            };
        case 'SET_DIVORCE_UPDATE_REQUEST':
            return {
                ...state,
                updateRequest: !state.updateRequest
            };
        case 'CLEAR_DIVORCE':
            return {
                ...initialState.divorce,
                success: state.success,
                error: state.error
            };
        case 'CLEAR_DIVORCE_ACCEPTED_FILES':
            return {
                ...state,
                acceptedFilesSex: [],
                previewsSex: [],
                acceptedFilesMasonry: [],
                previewsMasonry: [],
                acceptedFilesExit: [],
                previewsExit: []
            };
        case 'DELETE_DIVORCE_REPORT':
            return {
                ...state,
                reports: [...payload]
            };
        default:
            return state;
    }
};

export default divorce;
