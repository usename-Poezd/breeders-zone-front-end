import {IMessage, IRoom} from "../../types";
import {AnyAction} from "redux";

const GET_MESSAGE_REQUEST = 'GET_MESSAGE_REQUEST';
const GET_MESSAGE_REQUEST_CLEAR = 'GET_MESSAGE_REQUEST_CLEAR';
const ADD_MESSAGE = 'ADD_MESSAGE';
const UPDATE_LOAD_MESSAGE = 'UPDATE_LOAD_MESSAGE';
const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
const SET_ROOMS = 'SET_ROOMS';
const ADD_ROOMS = 'ADD_ROOMS';
const SELECT_ROOM = 'SELECT_ROOM';
const SET_SELECTED_ROOM_MESSAGE = 'SET_SELECTED_ROOM_MESSAGE';
const CLEAR_SELECTED_ROOM = 'CLEAR_SELECTED_ROOM';
const SET_ROOMS_COUNT_WITH_NEW_MESSAGES = 'SET_ROOMS_COUNT_WITH_NEW_MESSAGES';
const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';
const NEW_ROOM = 'NEW_ROOM';
const CLEAR_CHAT = 'CLEAR_CHAT';
const SET_CHAT_ACT = 'SET_CHAT_ACT';
const SET_CHAT_REQUEST = 'SET_CHAT_REQUEST';
const SET_CHAT_PRODUCT = 'SET_CHAT_PRODUCT';
const UPDATE_CHECK_MESSAGE = 'UPDATE_CHECK_MESSAGE';

export interface IChatState {
    rooms_with_new_messages: number,
    selected_room_id: number|null,
    selected_room: {},
    rooms: Array<IRoom>,
    messages: Array<IMessage>,
    getMessagesRequest: boolean,
    messagesCancelToken: string|null,
    act: string,
    request: boolean
}

export type ChatActionsType = AnyAction;

export {
    GET_MESSAGE_REQUEST,
    GET_MESSAGE_REQUEST_CLEAR,
    ADD_MESSAGE,
    UPDATE_LOAD_MESSAGE,
    CLEAR_MESSAGES,
    SET_ROOMS,
    ADD_ROOMS,
    SELECT_ROOM,
    SET_SELECTED_ROOM_MESSAGE,
    CLEAR_SELECTED_ROOM,
    SET_ROOMS_COUNT_WITH_NEW_MESSAGES,
    RECEIVED_MESSAGE,
    NEW_ROOM,
    CLEAR_CHAT,
    SET_CHAT_ACT,
    SET_CHAT_REQUEST,
    SET_CHAT_PRODUCT,
    UPDATE_CHECK_MESSAGE
}
