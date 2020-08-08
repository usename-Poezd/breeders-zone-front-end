const initialState = {
    modals: {
        report: {
            show: false,
            productId: null,
            divorceId: null,
            request: false,
            success: null,
            error: null
        }
    },
    kinds: {
        all: [],
        active: [],
        activeKind: {
            title_rus: '',
            title_eng: ''
        }
    },
    countries: {
        all: []
    },
    documents: {
        agree: []
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
                level: 1,
                title: ''
            },
            country: null,
            guardians_kinds: [],
            notifications : [],
            unread_notifications_count: 0
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
        divorces: {
            total: 0,
            current_page: 1,
            last_page: 1,
            data: []
        },
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
            article: '',
            user_id: '',
            name: '',
            price: '',
            sex: 1,
            cb: null,
            is_active: true,
            kindId: '',
            reports: []
        },
        product_images: [],
        deletedImages: [],
        acceptedFiles: [],
        previews: [],
        searchResult: [],
        searchRequest: false,
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
        kind_id: null,
        subcategory_id: null,
        cb: '',
        title: '',
        reports: [],

        male: [],
        searchMaleRequest: false,
        searchResultMale: [],

        female: [],
        searchFemaleRequest: false,
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
        messagesCancelToken: null,
        act: '',
        request: true
    },
    search: {
        query: '',
        selectedKind: {
            has_subcategories: 0,
            localities: []
        },
        subcategoryId: null,
        localityId: null,
        priceFrom: 0,
        priceTo: 100000,
        searchMorphsInRequest: false,
        searchMorphResultIn: [],
        morphsIn: [],
        searchMorphsOutRequest: false,
        searchMorphResultOut: [],
        morphsOut: [],
        minMorphs: 0,
        maxMorphs: 9,
        age: 'any',
        sex: 'any'
    }
};

export default initialState;
