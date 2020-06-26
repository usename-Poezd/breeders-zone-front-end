import initialState from "./initialState";

const chat = (state, action) => {
    const payload = action.payload;
    if (state === undefined) {
        return initialState.chat;
    }

    switch (action.type) {
        case 'GET_MESSAGE_REQUEST':
            return {
                ...state,
                getMessagesRequest: true,
                messagesCancelToken: payload
            };
        case 'GET_MESSAGE_REQUEST_CLEAR':
            return {
                ...state,
                getMessagesRequest: false
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, payload]
            };
        case 'UPDATE_LOAD_MESSAGE':

            const messageIdx = state.messages.findIndex((item) => item.newMessageKey === payload.newMessageKey);
            if (messageIdx >= 0) {
                state.messages[messageIdx].messageId = payload.id;
                state.messages[messageIdx].newMessageKey = '';
            }
            return {
                ...state,
                messages: [...state.messages]
            };
        case 'UPDATE_CHECK_MESSAGE':
            payload.map( ({id}) => {
                const messageIdx = state.messages.findIndex((item) => item.messageId === id);
                if (messageIdx >= 0) {
                    state.messages[messageIdx].checked = 1;
                }
            });
            return {
                ...state,
                messages: [...state.messages]
            };
        case 'CLEAR_MESSAGES':
            return {
                ...state,
                messages: []
            };
        case 'SET_ROOMS':

            return {
                ...state,
                rooms: payload
            };
        case 'ADD_ROOMS':
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
        case 'SELECT_ROOM':
            return {
                ...state,
                roomsWithNewMessages: payload.roomsWithNewMessages,
                selected_room: payload.room,
                selected_room_id: payload.roomId
            };
        case 'SET_SELECTED_ROOM_MESSAGE':
            const roomIdx = state.rooms.findIndex(item => item.room.id === state.selected_room_id);
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
        case 'CLEAR_SELECTED_ROOM':
            return {
                ...state,
                selected_room: {},
                selected_room_id: null
            };
        case 'SET_ROOMS_COUNT_WITH_NEW_MESSAGES':
            return {
                ...state,
                roomsWithNewMessages: payload
            };
        case 'RECEIVED_MESSAGE':
            return {
                ...state,
                rooms: [payload, ...state.rooms]
            };
        case 'NEW_ROOM':
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
        case 'CLEAR_CHAT':
            return {
                ...initialState.chat
            };
        case 'SET_CHAT_ACT':
            return  {
                ...state,
                act: payload
            };
        default:
            return state;
    }
};

export default chat;
