import {DataService} from "../services";

const dataService = new DataService();

export const setDivorce = (payload) =>  {
    return {
        type: 'SET_DIVORCE',
        payload
    }
};

export const setDivorceRequest = () => {
    return {
        type: 'SET_DIVORCE_REQUEST'
    }
};

export const setDivorceCb = (payload) => {
    return {
        type: 'SET_DIVORCE_CB',
        payload
    }
};

export const deleteMaleAndFemaleMorphs = () => {
    return {
        type: 'DELETE_MALE_AND_FEMALE_MORPHS'
    }
};

export const setDivorceSearchResultMale = (payload) => {
    return {
        type: 'SET_DIVORCE_SEARCH_RESULT_MALE',
        payload
    }
};

export const setSelectedMorphMale = (payload) => (dispatch, getState) => {
    const state = getState();
    const selectedMorphs = state.divorce.male;
    const searchResult = state.divorce.searchResultMale;
    const filteredArray = selectedMorphs.filter((gene) => gene.id === searchResult[payload].id);
    const maleMorph = state.divorce.searchResultMale[payload];
    maleMorph.gene = {
        id: maleMorph.id,
        title: maleMorph.title,
        type: maleMorph.type
    };


    if (filteredArray.length === 0) {
        dispatch({
            type: 'SET_MALE_MORPHS',
            payload: maleMorph
        });
    }
};

export const clearDivorceSearchResultMale = () => {
    return {
        type: 'CLEAR_DIVORCE_SEARCH_RESULT_MALE'
    }
};

export const deleteMaleMorph = (payload) => {
    return {
        type: 'DELETE_MALE_MORPH'
    }
};


export const setDivorceSearchResultFemale = (payload) => {
    return {
        type: 'SET_DIVORCE_SEARCH_RESULT_FEMALE',
        payload
    }
};

export const setSelectedMorphFemale = (payload) => (dispatch, getState) => {
    const state = getState();
    const selectedMorphs = state.divorce.female;
    const searchResult = state.divorce.searchResultFemale;
    const filteredArray = selectedMorphs.filter((gene) => gene.id === searchResult[payload].id);
    const femaleMorph = state.divorce.searchResultFemale[payload];
    femaleMorph.gene = {
        id: femaleMorph.id,
        title: femaleMorph.title,
        type: femaleMorph.type
    };


    if (filteredArray.length === 0) {
        dispatch({
            type: 'SET_FEMALE_MORPHS',
            payload: femaleMorph
        });
    }
};

export const clearDivorceSearchResultFemale = () => {
    return {
        type: 'CLEAR_DIVORCE_SEARCH_RESULT_FEMALE'
    }
};


export const deleteFemaleMorph = (payload) => {
    return {
        type: 'DELETE_FEMALE_MORPH'
    }
};

export const setAcceptedFilesSex = (payload) => {
    const previews = [];
    const acceptedFiles = payload;
    for (let item of payload){
        previews.push(URL.createObjectURL(item))
    }
    const newPayload = {
        acceptedFiles,
        previews
    };
    return {
        type: 'SET_ACCEPTED_FILES_SEX',
        payload: newPayload
    }
};

export const setAcceptedFilesMasonry = (payload) => {
    const previews = [];
    const acceptedFiles = payload;
    for (let item of payload){
        previews.push(URL.createObjectURL(item))
    }
    const newPayload = {
        acceptedFiles,
        previews
    };
    return {
        type: 'SET_ACCEPTED_FILES_MASONRY',
        payload: newPayload
    }
};

export const setAcceptedFilesExit = (payload) => {
    const previews = [];
    const acceptedFiles = payload;
    for (let item of payload){
        previews.push(URL.createObjectURL(item))
    }
    const newPayload = {
        acceptedFiles,
        previews
    };
    return {
        type: 'SET_ACCEPTED_FILES_EXIT',
        payload: newPayload
    }
};

export const deleteAcceptedFileSex = (payload) => {
    return {
        type: 'DELETE_ACCEPTED_FILE_SEX',
        payload
    }
};

export const deleteAcceptedFileMasonry = (payload) => {
    return {
        type: 'DELETE_ACCEPTED_FILE_MASONRY',
        payload
    }
};

export const deleteAcceptedFileExit = (payload) => {
    return {
        type: 'DELETE_ACCEPTED_FILE_EXIT',
        payload
    }
};

export const deleteSexPhoto = (payload) => {
    return {
        type: 'DELETE_SEX_PHOTO',
        payload
    }
};
export const deleteMasonryPhoto = (payload) => {
    return {
        type: 'DELETE_MASONRY_PHOTO',
        payload
    }
};
export const deleteExitPhoto = (payload) => {
    return {
        type: 'DELETE_EXIT_PHOTO',
        payload
    }
};

export const setDivorceUpdateRequest = () => {
    return {
        type: 'SET_DIVORCE_UPDATE_REQUEST'
    }
};

export const setDivorceSuccess = (payload) => {
    return {
        type: 'SET_DIVORCE_SUCCESS',
        payload
    }
};

export const clearDivorceSuccess = (payload) => {
    return {
        type: 'CLEAR_DIVORCE_SUCCESS',
        payload
    }
};

export const setDivorceError = (payload) => {
    return {
        type: 'SET_DIVORCE_ERROR',
        payload
    }
};

export const clearDivorceError = (payload) => {
    return {
        type: 'CLEAR_DIVORCE_ERROR',
        payload
    }
};

export const clearDivorce = () => {
    return {
        type: 'CLEAR_DIVORCE'
    }
};

export const clearDivorceAcceptedFiles = () => {
    return {
        type: 'CLEAR_DIVORCE_ACCEPTED_FILES'
    }
};

export const deleteDivorceReport = (payload) => (dispatch, getState) => {
    const divorceReports = getState().divorce.reports;
    const reportIdx = divorceReports.findIndex((item) => item.id === payload);
    divorceReports.splice(reportIdx, 1);

    dataService.checkReport(payload);

    dispatch({
        type: 'DELETE_DIVORCE_REPORT',
        payload: divorceReports
    })
};

export const setSearchMaleRequest = (payload) => {
    return {
        type: 'SET_SEARCH_MALE_REQUEST',
        payload
    };
};

export const setSearchFemaleRequest = (payload) => {
    return {
        type: 'SET_SEARCH_FEMALE_REQUEST',
        payload
    };
};