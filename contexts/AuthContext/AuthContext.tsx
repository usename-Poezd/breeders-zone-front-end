import React, {createContext, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {IRootState} from "../../redux/store";
import {getUser} from "../../redux/Auth";

const AuthContext = createContext({});

const AuthConsumer = AuthContext.Consumer;

const AuthProvider = ({ children }) => {

    const {isLogin, loginRequest} = useSelector(({auth: {isLogin, loginRequest}}: IRootState) => ({isLogin, loginRequest}));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, []);



    return (
        <AuthContext.Provider value={{ isLogin: !!isLogin, loading: loginRequest}}>
            {children}
        </AuthContext.Provider>
    )
};

export {
    AuthContext,
    AuthConsumer,
    AuthProvider
};
