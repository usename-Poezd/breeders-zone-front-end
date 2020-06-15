import initialState from "./initialState";

const modals = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.modals;
    }

    switch (action.type) {
        case 'SET_REPORT_MODAL_SHOW':
            return {
                ...state,
                report: {
                    ...state.report,
                    show: payload
                }
            };
        case 'SET_REPORT_MODAL_PRODUCT_ID':
            return {
                ...state,
                report: {
                    ...state.report,
                    productId: payload,
                    divorceId: null
                }
            };
        case 'SET_REPORT_MODAL_DIVORCE_ID':
            return {
                ...state,
                report: {
                    ...state.report,
                    divorceId: payload,
                    productId: null
                }
            };
        case 'SET_REPORT_MODAL_SUCCESS':
            return {
                ...state,
                report: {
                    ...state.report,
                    success: payload,
                    error: null
                }
            };
        case 'SET_REPORT_MODAL_ERROR':
            return {
                ...state,
                report: {
                    ...state.report,
                    success: null,
                    error: payload
                }
            };
        case 'SET_REPORT_MODAL_REQUEST':
            return {
                ...state,
              report: {
                    ...state.report,
                    request: payload
              }
            };
        default:
            return state;
    }
};

export default modals;
