import React, {FC} from 'react';
import Link from 'next/link';
import {Spinner} from 'react-bootstrap';
import {connect} from "react-redux";
import {login} from "../redux/Auth";
import {IRootState} from "../redux/store";
import {ILoginDispatchProps, ILoginFormInitialValues, ILoginStateProps, LoginPropsType} from "./types";
import {Formik, FormikProps, Field, Form as FormikForm} from "formik";
import * as Yup from "yup";

import {FormInput} from "../components/Form";
import {ContinueRegistration} from "./components/ContinueRegistration";

const initialValues: ILoginFormInitialValues = {
    email: '',
    password: '',
};

const LoginComponent:FC<LoginPropsType> = (props) => {
    const {loginRequest, loginError} = props;

    const onSubmit = (data) => {
        const { login } = props;
        login(data)
    };

    return (
        <React.Fragment>
            <div className="login form-container">
                <h1 className="form-container-title">Вход</h1>
                {
                    !loginRequest && loginError.message &&
                    <div className="feather-shadow text-center p-3 mb-3 border-10">
                        <h3 className="text-danger mb-1">Не удается войти.</h3>
                        <p className="form-err ">Пожалуйста, проверьте правильность написания логина и пароля.</p>
                    </div>
                }
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .required('Электронная почта должна быть указанна')
                            .email('Электронная почта введена не парвильно'),
                        password: Yup.string()
                            .required('Пароль должен быть указан')
                    })}
                >
                    {
                        (props: FormikProps<ILoginFormInitialValues>) => {
                            if (loginRequest) {
                                return (
                                    <div className="d-flex py-3">
                                        <Spinner animation="border" className="m-auto"/>
                                    </div>
                                )
                            }


                            return (
                                <FormikForm>
                                    <Field name="email" placeholder="Электронная почта" component={FormInput} />

                                    <Field name="password" type="password" placeholder="Пароль" component={FormInput} />

                                    <div className="controls d-flex align-items-center">
                                        <input type="submit" value="Войти" className="btn btn-main w-100"/>
                                        <Link href="/reset">
                                            <a  className="forgot-pass w-100">Забыли пароль?</a>
                                        </Link>
                                    </div>
                                </FormikForm>
                            )
                        }
                    }
                </Formik>
            </div>
            <ContinueRegistration/>
        </React.Fragment>
    );
};

const mapStateToProps = ({auth: {isLogin, loginRequest, loginError}}: IRootState): ILoginStateProps => ({
    isLogin,
    loginError,
    loginRequest
});

const Login = connect<ILoginStateProps, ILoginDispatchProps>(mapStateToProps, {login})(LoginComponent);

export {
    Login
}

