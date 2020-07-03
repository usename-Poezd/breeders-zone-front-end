import {Message} from "react-chat-ui";
import Axios from "axios";
import {DataService} from "../services";
import UpgradedMassage from "../utils/upgraded-message";
const dataService = new DataService();
import { Cookies } from 'react-cookie';
// set up cookies
const cookies = new Cookies();


export const clearChat = () => {
    return {
        type: 'CLEAR_CHAT'
    }
};

export const getMessagesRequest = (payload) => {
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

export const getMessages = (payload) => (dispatch, getState) => {
    const token = cookies.get('token');
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
                'Authorization': `Bearer ${token}`
            }
        }
    )
        .then( (res) => res.data)
        .then( (data) => {
            data.map( (item) => {
                dispatch(addMessage(item));
            });
            dispatch(getMessagesRequestClear());
        });
};

export const addMessage = (payload) => {
    payload = new UpgradedMassage(payload);
    return {
        type: 'ADD_MESSAGE',
        payload
   }
};

export const updateLoadMessage = (payload) => {
    return {
        type: 'UPDATE_LOAD_MESSAGE',
        payload
    }
};

export const updateCheckMessage = (payload) => {
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

export  const setRooms = (payload) => {
    return {
        type: 'SET_ROOMS',
        payload
    }
};

export  const addRooms = (payload) => {
    return {
        type: 'ADD_ROOMS',
        payload
    }
};

export const newRoom = (payload) => (dispatch) => {
    dispatch({
        type: 'NEW_ROOM',
        payload
    });
};

export const selectRoom = (payload) => (dispatch, getState) => {
    const token = cookies.get('token');
    const state = getState();
    if(state.chat.selected_room_id !== null) {
        window.Echo.leaveChannel(`private-room.${state.chat.selected_room_id}`);
    }

    if (state.chat.selected_room_id !== null && state.chat.selected_room_id !== payload) {
        dispatch(clearMessages());
    }

    if(state.chat.selected_room_id !== payload && !state.chat.rooms.find((item) => item.room.id === payload)) {
        Axios.get(`/api/room/${payload}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
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
        const room = state.chat.rooms.filter( (item) => item.room.id === payload)[0];
        let roomsWithNewMessages = state.chat.roomsWithNewMessages;
        if (room.newMessage) {
            roomsWithNewMessages--;
        }
        room.newMessage = false;
        room.newMessageCount = 0;

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

export const getRooms = () => (dispatch, getState) => {
    const token = cookies.get('token');
    const store = getState();
    dispatch(setChatRequest(true));
    return Axios.get(
        '/api/rooms',
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then( (res) => res.data)
        .then( (data) => {
            dispatch(setRooms(data));
            dispatch(setChatRequest(false));
        });
};

export const receivedMessage = (payload) => (dispatch, getState) => {
    const state = getState();
    const rooms = state.chat.rooms;
    const room = rooms.findIndex(({room}, idx) => room.id === payload.room_id);

    if (payload.room_id !== state.chat.selected_room_id) {
        dispatch(getRoomsCountWithNewMessages());
    }

    if(rooms[room] && payload.room_id !== state.chat.selected_room_id) {
        const tmp = rooms[room];
        tmp.message = payload.message;
        rooms.splice(room, 1);
        rooms.unshift({...tmp, newMessage: true, newMessageCount: tmp.newMessageCount + 1});
        dispatch(setRooms([...rooms]));
    } else if (!rooms[room])  {
        dataService.getRoom(payload.room_id)
            .then((data) => {
                dispatch(setRooms([data, ...rooms]));
            })
    }
};

export const getRoomsCountWithNewMessages = () => (dispatch) => {
    const token = cookies.get('token');
    return Axios.get(
        '/api/rooms-with-new-message',
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then( (res) => res.data)
        .then( (data) => {
            dispatch(setRoomsCountWithNewMessages(data))
        });
};

export const setRoomsCountWithNewMessages = (payload) => {
    return {
        type: 'SET_ROOMS_COUNT_WITH_NEW_MESSAGES',
        payload
    }
};

export const setSelectedRoomMessage = (payload) => {
    return {
        type: 'SET_SELECTED_ROOM_MESSAGE',
        payload
    }
};

export const setChatAct = (payload) => {
    return {
        type: 'SET_CHAT_ACT',
        payload
    }
};

export const setChatRequest = (payload) => {
    return {
        type: 'SET_CHAT_REQUEST',
        payload
    }
}