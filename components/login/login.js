import React, { Component } from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import {withHookForm, withGetData} from '../hoc-helpers';
import { useForm } from "react-hook-form";
import {connect} from "react-redux";
import {getUser} from "../../actions";
import GroupFormControl from "../group-form-control";
import Router from 'next/router'

class Login extends Component {

    state = {
        serverError: null
    };

    login = data => {
        const { postLogin, getUser } = this.props;
        postLogin(data)
            .then( () => {
                Router.push('/');
                getUser();
            })
            .catch( (error) =>  {
                if (error.response.status === 403) {
                    Router.push('/verify');
                }
                this.setState({ serverError: error });
            });
    };

    render() {
        const { serverError } = this.state;
        const { register, handleSubmit, errors, isLogin } = this.props;

        if (isLogin && typeof window !== 'undefined') {
            Router.push('/');
        }

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
                <Form onSubmit={handleSubmit(this.login)} className="form login-form">
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
    }
}

const mapMethodsToProps = (getData) => {
    return {
        postLogin: getData.postLogin
    }
};

const mapStateToProps = ({auth: {isLogin}}) => ({
    isLogin
});


export default connect(mapStateToProps, {getUser})(
   withGetData(
            withHookForm(Login, useForm),
            mapMethodsToProps
   )
);
