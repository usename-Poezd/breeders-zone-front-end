import {call, put, takeEvery} from "redux-saga/effects";
import {ILoginAction, LOGIN, GET_USER, REGISTRATION, IRegistrationAction, IGetUserAction} from "./types";
import {Api, DataService} from "../../services";
import {loginRequest, loginSuccess, setIsLogin, setLoginError, setRegError, setUser} from "./actions";
import {push} from "connected-next-router";
import * as Cookie from "es-cookie";
import Echo from "laravel-echo";
import {setRoomsCountWithNewMessages} from "../Chat";

declare global {
    interface Window {
        Echo: Echo,
        io: any
    }
}



export function* authWatcher() {
    yield takeEvery(LOGIN, loginSaga);
    yield takeEvery(GET_USER, getUserSaga);
    yield takeEvery(REGISTRATION, registrationSaga)
}

function* loginSaga(action: ILoginAction) {
    try {
        const dataService = yield new DataService();

        yield put(loginRequest());
        const data = yield call(() => dataService.postLogin(action.payload));
        yield put(push('/'));
        yield put(setUser(data.data.user));
        yield put(setRoomsCountWithNewMessages(data.rooms_with_new_messages));
        yield put(loginSuccess());

        window.io = require('socket.io-client');
        window.Echo =  window.Echo = yield new Echo({
            broadcaster: 'socket.io',
            wsHost: window.location.hostname,
            wsPort: 6001,
            disableStats: false,
            auth: {
                headers: {
                    Authorization: `Bearer ${data.data.access_token}`
                }
            }
        });
    } catch (error) {
        if (error.response.status === 403) {
            yield put(push('/verify'));
        }
        yield put(setLoginError({
            message: error.response.data.message,
            errors: error.response.data.error.errors,
            status: error.response.status
        }));
    }
}

function* getUserSaga(action: IGetUserAction) {
    try {
        const token = action.payload || Cookie.get('token');
        if (token) {
            const dataService = yield new DataService();

            Api.defaults.headers.Authorization = `Bearer ${token}`;
            // window.io = require('socket.io-client');
            // window.Echo =  window.Echo = yield new Echo({
            //     broadcaster: 'socket.io',
            //     wsHost: window.location.hostname,
            //     wsPort: 6001,
            //     disableStats: false,
            //     auth: {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         }
            //     }
            // });

            yield put(setIsLogin(true));
            yield put(loginRequest());
            const {data} = yield call(() => dataService.getUser());
            yield put(setUser(data));
            yield put(setRoomsCountWithNewMessages(data.rooms_with_new_messages));
            yield put(loginSuccess());
        }
    } catch (error) {
        if (error.response.status === 403) {
            yield put(push('/verify'))
        }

        if (error.response.status === 401) {
            yield delete Api.defaults.headers.Authorization;
            yield Cookie.remove('token');
        }

        yield put(setIsLogin(false))
    }
}

function* registrationSaga(action: IRegistrationAction) {
    try {
        const dataService = yield new DataService();

        yield put(loginRequest());
        yield call(() => dataService.postRegister(action.payload));
        yield put(loginSuccess());

    } catch (error) {
        yield put(setRegError({
            message: error.response.data.message,
            errors: error.response.data.error.errors,
            status: error.response.status
        }));
    }
}
