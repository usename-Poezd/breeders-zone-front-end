import DataService from "../services/dataService";
import Echo from "laravel-echo";
import {receivedMessage, setRoomsCountWithNewMessages, updateCheckMessage} from "./chat";

const dataService = new DataService();

import { Cookies } from 'react-cookie';
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

export const logout = () => (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'LOGOUT' });
    dataService.postLogout();
    window.Echo.leaveChannel(`private-room.${state.chat.selected_room_id}`);
    window.Echo.leaveChannel(`private-App.User.${state.profile.user.id}`);
    window.Echo.disconnect();
    dispatch({ type: 'USER_CLEAR'});
    cookies.remove("token");
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
                    window.Pusher = require('pusher-js');
                    window.Echo = new Echo({
                        broadcaster: 'pusher',
                        key: process.env.MIX_PUSHER_APP_KEY,
                        cluster: process.env.MIX_PUSHER_APP_CLUSTER,
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
                            console.log(notification);
                            switch (notification.type) {
                                case 'App\\Notifications\\NewMessageNotification':
                                    dispatch(receivedMessage(notification[0]));
                                    break;
                                case 'App\\Notifications\\CheckMessagesNotification':
                                    dispatch(updateCheckMessage(notification[0]));
                                    break;
                            }

                        });
                }

                dispatch(setRoomsCountWithNewMessages(data.roomsWithNewMessages));
                dispatch(getUserData(data));
                dispatch(loginSuccess());

                return true;
            })
            .catch((error) => {
                dispatch({ type: 'LOGOUT' });
                if (!tokenServer) {
                    cookies.remove("token");
                }

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
