import {HYDRATE} from "next-redux-wrapper";
import {diff} from "jsondiffpatch";
import {
    ADD_MESSAGE,
    ADD_ROOMS,
    ChatActionsType, CLEAR_CHAT,
    CLEAR_MESSAGES,
    CLEAR_SELECTED_ROOM,
    GET_MESSAGE_REQUEST,
    GET_MESSAGE_REQUEST_CLEAR,
    IChatState, NEW_ROOM, RECEIVED_MESSAGE,
    SELECT_ROOM, SET_CHAT_ACT, SET_CHAT_PRODUCT, SET_CHAT_REQUEST,
    SET_ROOMS,
    SET_ROOMS_COUNT_WITH_NEW_MESSAGES,
    SET_SELECTED_ROOM_MESSAGE,
    UPDATE_CHECK_MESSAGE,
    UPDATE_LOAD_MESSAGE
} from "./types";

const initialState: IChatState = {
    rooms_with_new_messages: 0,
    selected_room_id: null,
    selected_room: {},
    rooms: [],
    messages: [],
    getMessagesRequest: false,
    messagesCancelToken: null,
    act: '',
    request: true
};

const chatReducer = (state = initialState, action: ChatActionsType) => {
    const payload = action.payload;
    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, payload.chat);
            return {
                ...state,
                ...payload.chat,
                rooms_with_new_messages: stateDiff?.rooms_with_new_messages?.[0] > 0 ? state.rooms_with_new_messages : payload.chat.rooms_with_new_messages,
                rooms: stateDiff?.rooms?.['_0']?.[0] === state.rooms?.[0] ? state.rooms : payload.chat.rooms,
                request: stateDiff?.request?.[0] === false ? state.request : payload.chat.request
            };
        case GET_MESSAGE_REQUEST:
            return {
                ...state,
                getMessagesRequest: true,
                messagesCancelToken: payload
            };
        case GET_MESSAGE_REQUEST_CLEAR:
            return {
                ...state,
                getMessagesRequest: false
            };
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, payload]
            };
        case UPDATE_LOAD_MESSAGE:

            const messageIdx = state.messages.findIndex((item) => item.newMessageKey === payload.newMessageKey);
            if (messageIdx >= 0) {
                state.messages[messageIdx].id = payload.id;
                state.messages[messageIdx].newMessageKey = '';
            }
            return {
                ...state,
                messages: [...state.messages]
            };
        case UPDATE_CHECK_MESSAGE:
            payload.map( ({id}) => {
                const messageIdx = state.messages.findIndex((item) => item.id === id);
                if (messageIdx >= 0) {
                    state.messages[messageIdx].checked = true;
                }
            });
            return {
                ...state,
                messages: [...state.messages]
            };
        case CLEAR_MESSAGES:
            return {
                ...state,
                messages: []
            };
        case SET_ROOMS:

            return {
                ...state,
                rooms: payload
            };
        case ADD_ROOMS:
            if (Array.isArray(payload)) {
                return {
                    ...state,
                    rooms: [...state.rooms, ...payload]
                };
            }

            return {
                ...state,
                rooms: [...state.rooms, payload]
            };
        case SELECT_ROOM:
            return {
                ...state,
                rooms_with_new_messages: payload.rooms_with_new_messages,
                selected_room: payload.room,
                selected_room_id: payload.roomId
            };
        case SET_SELECTED_ROOM_MESSAGE:
            const roomIdx = state.rooms.findIndex(item => item.id === state.selected_room_id);
            const rooms  = state.rooms;
            rooms[roomIdx].message = payload;
            return {
                ...state,
                rooms: [...rooms],
                selected_room: {
                    ...state.selected_room,
                    message: payload
                }
            };
        case CLEAR_SELECTED_ROOM:
            return {
                ...state,
                selected_room: {},
                selected_room_id: null
            };
        case SET_ROOMS_COUNT_WITH_NEW_MESSAGES:
            return {
                ...state,
                rooms_with_new_messages: payload
            };
        case RECEIVED_MESSAGE:
            return {
                ...state,
                rooms: [payload, ...state.rooms]
            };
        case NEW_ROOM:
            const newRoom = {
                room: {
                    id: payload.id
                },
                users: [payload.user]
            };
            return {
                ...state,
                selected_room_id: payload.id,
                selected_room: newRoom,
                rooms: [newRoom, ...state.rooms]
            };
        case CLEAR_CHAT:
            return {
                ...initialState
            };
        case SET_CHAT_ACT:
            return {
                ...state,
                act: payload
            };
        case SET_CHAT_REQUEST:
            return {
                ...state,
                request: payload
            };
        case SET_CHAT_PRODUCT:
            return {
                ...state,
                product: payload
            };
        default:
            return state;
    }
};

export {
    chatReducer
};
