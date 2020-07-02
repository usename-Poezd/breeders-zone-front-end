import DataService from "../services/dataService";
import Echo from "laravel-echo";
import {receivedMessage, setRoomsCountWithNewMessages, updateCheckMessage} from "./chat";

const dataService = new DataService();

import { Cookies } from 'react-cookie';
import {addNotification} from "./profile";
// set up cookies
const cookies = new Cookies();


export const loginRequest = () => {
    return {
        type: 'LOGIN_REQUEST'
    }
};

export const loginSuccess = () => {
    return {
        type: 'LOGIN_SUCCESS'
    }
};

export const logout = (tokenNotWork= false) => (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'LOGOUT' });
    if (!tokenNotWork)
        dataService.postLogout();
    const cookies = new Cookies();
    const expires = new Date(Date.now() + 100).toUTCString();
    cookies.set('token', '', {maxAge: 100});
    window.Echo.leaveChannel(`private-room.${state.chat.selected_room_id}`);
    window.Echo.leaveChannel(`private-App.User.${state.profile.user.id}`);
    window.Echo.disconnect();
    dispatch({ type: 'USER_CLEAR'});
};

export const getUserData = (payload) => {
    return {
        type: 'GET_USER',
        payload: payload
    }
};

export const getUser = (tokenServer = '') => (dispatch) => {

    const token = cookies.get('token');
    if(token || tokenServer) {
        dispatch(loginRequest());
        return dataService.getUserData(tokenServer ? tokenServer : token)
            .then((data) => {

                if (!tokenServer) {
                    window.io = require('socket.io-client');
                    window.Echo = new Echo({
                        broadcaster: 'socket.io',
                        wsHost: window.location.hostname,
                        wsPort: 6001,
                        disableStats: false,
                        auth: {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        }
                    });

                    window.Echo.private(`App.User.${data.id}`)
                        .notification((notification) => {
                            switch (notification.type) {
                                case 'App\\Notifications\\NewMessageNotification':
                                    dispatch(receivedMessage(notification[0]));
                                    break;
                                case 'App\\Notifications\\CheckMessagesNotification':
                                    dispatch(updateCheckMessage(notification[0]));
                                    break;
                                default:
                                    dispatch(addNotification(notification));
                            }

                        });
                }
                dispatch(getUserData(data));

                dispatch(setRoomsCountWithNewMessages(data.roomsWithNewMessages));
                dispatch(loginSuccess());

                return true;
            })
            .catch((error) => {
                dispatch(logout(true));
                return false;
            });
    }
};

export const setRegError = (payload) => {
    return {
        type: 'REG_ERROR',
        payload: payload
    }
};
