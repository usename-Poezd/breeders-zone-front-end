import Axios from "axios";
import {Api, DataService} from "../../services";
import UpgradedMassage from "../../utils/upgraded-message";
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import {IRootState} from "../store";


export const clearChat = () => {
    return {
        type: 'CLEAR_CHAT'
    }
};

export const getMessagesRequest = (payload: any) => {
    return {
        type: 'GET_MESSAGE_REQUEST',
        payload
    }
};

export const getMessagesRequestClear = () => {
    return {
        type: 'GET_MESSAGE_REQUEST_CLEAR'
    }
};

export const getMessages = (payload: any): ThunkAction<void, IRootState, {}, AnyAction> => (dispatch, getState) => {
    const state = getState();

    const CancelToken = Axios.CancelToken;
    const source = CancelToken.source();

    if (state.chat.messagesCancelToken) {
        state.chat.messagesCancelToken.cancel();
    }

    dispatch(getMessagesRequest(source));
    Axios.get(
        '/api/messages?roomId=' + payload,
        {
            cancelToken: source.token,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${'token'}`
            }
        }
    )
        .then( (res) => res.data)
        .then( (data) => {
            data.map( (item: any) => {
                dispatch(addMessage(item));
            });
            dispatch(getMessagesRequestClear());
        });
};

export const addMessage = (payload: any) => {
    payload = new UpgradedMassage(payload);
    return {
        type: 'ADD_MESSAGE',
        payload
   }
};

export const updateLoadMessage = (payload: any) => {
    return {
        type: 'UPDATE_LOAD_MESSAGE',
        payload
    }
};

export const updateCheckMessage = (payload: any) => {
    return {
        type: 'UPDATE_CHECK_MESSAGE',
        payload
    }
};

export const clearMessages = () => {
    return {
        type: 'CLEAR_MESSAGES'
    }
};

export  const setRooms = (payload: any) => {
    return {
        type: 'SET_ROOMS',
        payload
    }
};

export  const addRooms = (payload: any) => {
    return {
        type: 'ADD_ROOMS',
        payload
    }
};

export const newRoom = (payload: any): ThunkAction<void, IRootState, any, AnyAction> => (dispatch) => {
    dispatch({
        type: 'NEW_ROOM',
        payload
    });
};

export const selectRoom = (payload: any): ThunkAction<void, IRootState, any, AnyAction> => (dispatch, getState) => {
    const state = getState();
    if(state.chat.selected_room_id !== null) {
        window.Echo.leaveChannel(`private-room.${state.chat.selected_room_id}`);
    }

    if (state.chat.selected_room_id !== null && state.chat.selected_room_id !== payload) {
        dispatch(clearMessages());
    }

    if(state.chat.selected_room_id !== payload && !state.chat.rooms.find((item) => item.id === payload)) {
        Api.get(`/api/room/${payload}`)
                .then( (res) => res.data)
                .then( (room) => {
                    room.newMessage = false;
                    room.newMessageCount = 0;
                    dispatch(addRooms(room));

                    dispatch({
                        type: 'SELECT_ROOM',
                        payload: {
                            room,
                            roomId: payload
                        }
                    });
                });

            return;
    }

    if(payload !== state.chat.selected_room_id ) {
        const room = state.chat.rooms.filter( (item) => item.id === payload)[0];
        let roomsWithNewMessages = state.chat.rooms_with_new_messages;
        if (room.new_message) {
            roomsWithNewMessages--;
        }
        room.new_message = false;
        room.new_message_count = 0;

        dispatch(getMessages(payload));

        dispatch({
            type: 'SELECT_ROOM',
            payload: {
                room: room,
                roomId: payload,
                roomsWithNewMessages
            }
        })
    }
};

export const clearSelectedRoom = () => {
    return {
        type: 'CLEAR_SELECTED_ROOM'
    }
};

export const getRooms = (): ThunkAction<void, IRootState, any, AnyAction> => (dispatch) => {
    dispatch(setChatRequest(true));
    return Api.get('/api/rooms')
        .then( (res) => res.data)
        .then( (data) => {
            dispatch(setRooms(data));
            dispatch(setChatRequest(false));
        });
};

export const receivedMessage = (payload: any): ThunkAction<void, IRootState, any, AnyAction> => (dispatch, getState) => {
    const dataService = new DataService();
    const state = getState();
    const rooms = state.chat.rooms;
    const room = rooms.findIndex(({id}) => id === payload.room_id);

    if (payload.room_id !== state.chat.selected_room_id) {
        dispatch(getRoomsCountWithNewMessages());
    }

    if(rooms[room] && payload.room_id !== state.chat.selected_room_id) {
        const tmp = rooms[room];
        tmp.message = payload.message;
        rooms.splice(room, 1);
        rooms.unshift({...tmp, new_message: true, new_message_count: tmp.new_message_count ? tmp.new_message_count + 1 : 1});
        dispatch(setRooms([...rooms]));
    } else if (!rooms[room])  {
        dataService.getRoom(payload.room_id)
            .then((data) => {
                dispatch(setRooms([data, ...rooms]));
            })
    }
};

export const getRoomsCountWithNewMessages = (): ThunkAction<void, IRootState, any, AnyAction> => (dispatch) => {
    return Api.get('/api/rooms-with-new-message')
        .then( (res) => res.data)
        .then( (data) => {
            dispatch(setRoomsCountWithNewMessages(data))
        });
};

export const setRoomsCountWithNewMessages = (payload: any) => {
    return {
        type: 'SET_ROOMS_COUNT_WITH_NEW_MESSAGES',
        payload
    }
};

export const setSelectedRoomMessage = (payload: any) => {
    return {
        type: 'SET_SELECTED_ROOM_MESSAGE',
        payload
    }
};

export const setChatAct = (payload: any) => {
    return {
        type: 'SET_CHAT_ACT',
        payload
    }
};

export const setChatRequest = (payload: any) => {
    return {
        type: 'SET_CHAT_REQUEST',
        payload
    }
};

export const setChatProduct = (payload: any) => {
    return {
        type: 'SET_CHAT_PRODUCT',
        payload
    }
};
