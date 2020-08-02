import React, {Component} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {withGetData, withHookForm} from "../hoc-helpers";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {resetPasswordRequest, setResetPasswordError, setResetPasswordSuccess} from "../../actions";
import Spinner from "../spinner";
import {HandelSuccess, HandelError} from "../handels";
import {withRouter} from "next/router";
import Head from "next/head";

const ResetPasswordForm = ({password, passwordRegExp, onChange, errors, register }) => (
    <React.Fragment>
        <GroupFormControl
            label="Электронная почта"
            errors={errors}
            controls={{
                type: "text",
                name: "email",
                placeholder: "myMail123@mail.com",
                ref: register({
                    required: true,
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                })
            }}
        />
        <GroupFormControl
            label="Пароль"
            errors={errors}
            controls={{
                type: "password",
                name: "password",
                value: password,
                onChange: onChange,
                placeholder: "",
                min: 8,
                ref: register({
                    required: true,
                    minLength: 8
                })
            }}
        />
        <GroupFormControl
            label="Подтвердите пароль"
            errors={errors}
            controls={{
                type: "password",
                name: "confirmPassword",
                placeholder: "",
                ref: register({
                    required: true,
                    pattern: passwordRegExp
                })
            }}
        />
    </React.Fragment>
);

const ResetPassword = ({
   sendResetEmail,
   changePassword,
   router: {query},
   resetPasswordState,
   resetPasswordRequest,
   setResetPasswordSuccess,
   setResetPasswordError
}) => {

    const { register, handleSubmit, setValue, watch, errors } = useForm({
        defaultValues: {
            password: ''
        }
    });

    const { success, error, request } = resetPasswordState;
    const { resetToken } = query;

    const { password } = watch();

    const handleChange = (e) => {
        e.persist();
        setValue(e.target.name, e.target.value);
    };

    const sendEmail = (data) => {
        resetPasswordRequest();
        sendResetEmail(data)
            .then( data => {
                setResetPasswordSuccess(data.success);
                setTimeout(() => setResetPasswordSuccess(null), 3000);
            })
            .catch( error => {
                setResetPasswordError({errors: error.response.data.errors, status: error.status});
                setTimeout(() => setResetPasswordError({errors: null, status: null}), 3000);
            });
    };

    const submitChangePassword = (data) => {
        resetPasswordRequest();
        changePassword({...data, resetToken: resetToken})
            .then( data => {
                setResetPasswordSuccess(data.success);
                setTimeout(() => setResetPasswordSuccess(null), 3000);
            })
            .catch( error => {
                setResetPasswordError({errors: error.response.data.errors, status: error.status});
                setTimeout(() => setResetPasswordError({errors: null, status: null}), 3000);
            });
    };


    const passwordRegExp = new RegExp(password);

    if (request) {
        return (
            <Row className="justify-content-center mt-3">
                <Head>
                    <title>Сброс пароля | Breeders Zone</title>
                </Head>
                <Col xs={12} md={8} className="feather-shadow py-3">
                    <Spinner size={15}/>
                </Col>
            </Row>
        )
    }

    return (
        <Row className="justify-content-center mt-3">
            <Head>
                <title>Сброс пароля | Breeders Zone</title>
            </Head>
            <Col xs={12} md={8} className="feather-shadow">
                <Form
                    onSubmit={
                        resetToken ?
                            handleSubmit(submitChangePassword)
                            : handleSubmit(sendEmail)
                    }
                    className="reset-password-form p-3"
                >

                    <HandelSuccess success={success}/>
                    <HandelError error={error}/>


                    {
                        resetToken ?
                            <ResetPasswordForm
                                password={password}
                                passwordRegExp={passwordRegExp}
                                onChange={(e) => handleChange(e)}
                                register={register}
                                errors={errors}
                            />
                            :
                            <GroupFormControl
                                label="Электронная почта"
                                errors={errors}
                                controls={{
                                    type: "text",
                                    name: "email",
                                    placeholder: "myMail123@mail.com",
                                    ref: register({
                                        required: true,
                                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    })
                                }}
                            />
                    }

                    <input type="submit" value="Отправить" className="btn btn-main"/>
                </Form>
            </Col>
        </Row>
    )
};

const mapMethodsToProps = (getData) => ({
    sendResetEmail: getData.sendResetEmail,
    changePassword: getData.changePassword
});

const mapStateToProps = ({resetPassword: resetPasswordState}) => ({
    resetPasswordState
});

export default connect(mapStateToProps, { resetPasswordRequest, setResetPasswordSuccess, setResetPasswordError})(
    withRouter(
        withGetData(
            ResetPassword,
            mapMethodsToProps
        )
    )
);
