import React, {useState} from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import {withGetData} from '../hoc-helpers';
import { useForm } from "react-hook-form";
import {connect} from "react-redux";
import {getUser} from "../../actions";
import GroupFormControl from "../group-form-control";
import {withRouter} from 'next/router'

const Login = (props) => {
    const [serverError, setServerError] = useState(false);
    const {register, handleSubmit, errors} = useForm();

    const login = data => {
        const { postLogin, getUser, router } = props;
        postLogin(data)
            .then( () => {
                router.push('/');
                getUser();
            })
            .catch( (error) =>  {
                if (error.response.status === 403) {
                    router.push('/verify');
                }
                setServerError(error);
            });
    };

    return (
        <div className="login form-container">
            <h2 className="form-container-title">Вход</h2>
            {
                serverError ? (
                    <div className="feather-shadow text-center p-3 mb-3 border-10">
                        <h3 className="text-danger mb-1">Не удается войти.</h3>
                        <p className="form-err ">Пожалуйста, проверьте правильность написания логина и пароля.</p>
                    </div>
                ) : null
            }
            <Form onSubmit={handleSubmit(login)} className="form login-form">
                <GroupFormControl
                    errors={errors}
                    controls={{
                        type: "text",
                        name: "email",
                        placeholder: "Электронная почта",
                        ref: register({
                            required: true,
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })
                    }}
                />

                <GroupFormControl
                    errors={errors}
                    controls={{
                        type: "password",
                        name: "password",
                        placeholder: "Пароль",
                        ref: register({
                            required: true
                        })
                    }}
                />

                <div className="controls d-flex align-items-center">
                    <input type="submit" value="Войти" className="btn btn-main w-100"/>
                    <Link href="/reset">
                        <a  className="forgot-pass w-100">Забыли пароль?</a>
                    </Link>
                </div>

            </Form>
        </div>
    );
};

const mapMethodsToProps = (getData) => {
    return {
        postLogin: getData.postLogin
    }
};

const mapStateToProps = ({auth: {isLogin}}) => ({
    isLogin
});


export default connect(mapStateToProps, {getUser})(
   withRouter(
       withGetData(
           Login,
           mapMethodsToProps
       )
   )
);
