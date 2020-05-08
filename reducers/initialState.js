const initialState = {
    kinds: {
        all: [],
        active: [],
        activeKind: {
            title_rus: '',
            title_eng: ''
        }
    },
    auth: {
        isLogin: false,
        loginRequest: false,

        regError: {
            errors: null,
            status: null
        },
    },
    resetPasswordState: {
        request: false,
        success: null,
        error: {
            errors: null,
            status: null
        }
    },
    profile: {
        user: {
            is_breeder: false,
            is_guard: false,
            guard_level: {
                level: null,
                title: ''
            },
            guardians_kinds: []
        },
        changePassword: false,
        update: {
            request: false,
            previews: [],
            success: null,
            error: {
                errors: null,
                status: null
            }
        }
    },
    shop: {
        products: [],
        productsRequest: false,
        divorces: [],
        divorcesRequest: false,
        update: {
            previews: [],
            request: false,
            success: null,
            error: {
                errors: null,
                status: null
            }
        }
    },
    product: {
        info: {
            id: '',
            user_id: '',
            name: '',
            price: '',
            sex: 1,
            cb: undefined,
            kindId: ''
        },
        product_images: [],
        deletedImages: [],
        acceptedFiles: [],
        previews: [],
        searchResult: [],
        selectedMorphs: [],
        deletedMorphsKind: [], //here morphs who deleted where info kindId is changed
        localities: [],
        getRequest: false,
        updateRequest: false,
        success: null,
        error: {
            errors: null,
            status: null
        }
    },
    divorce: {
        id: null,
        kindId: null,
        subcategoryId: null,
        cb: '',
        title: '',

        male: [],
        searchResultMale: [],

        female: [],
        searchResultFemale: [],

        sexPhotos: [],
        acceptedFilesSex: [],
        previewsSex: [],

        masonryPhotos: [],
        acceptedFilesMasonry: [],
        previewsMasonry: [],

        exitPhotos: [],
        acceptedFilesExit: [],
        previewsExit: [],

        updateRequest: false,
        success: null,
        error: {
            errors: null,
            status: null
        }
    },
    chat: {
        roomsWithNewMessages: 0,
        selected_room_id: null,
        selected_room: {},
        rooms: [],
        messages: [],
        getMessagesRequest: false,
        messagesCancelToken: null
    },
    search: {
        query: '',
        selectedKind: {
            has_subcategories: 0,
            localities: []
        },
        subcategoryId: null,
        selectedLocalities: [],
        priceFrom: 0,
        priceTo: 100000,
        searchMorphResultIn: [],
        morphsIn: [],
        searchMorphResultOut: [],
        morphsOut: [],
        minMorphs: 0,
        maxMorphs: 9,
        age: 'any',
        sex: 'any'
    }
};

export default initialState;
