import React, { Component } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { withHookForm } from '../hoc-helpers';
import GroupFormControl from "../group-form-control";
import Router, {withRouter} from 'next/router'

const ContinueRegistration = (props) => {
    const registerContinue = data => {
        const {router} = props;

        router.push(`/registration?name=${data.name}&surname=${data.surname}&email=${data.email}`)
    };

    const { register, handleSubmit, errors } = useForm();

    return (
        <div className="reg form-container">
            <h2 className="form-container-title">Впервые на Breeders Zone?</h2>
            <Form onSubmit={handleSubmit(registerContinue)} className="form login-form">
                <GroupFormControl
                    errors={errors}
                    controls={{
                        type: "text",
                        name: "name",
                        placeholder: "Имя",
                        ref: register({
                            required: true
                        })
                    }}
                />
                <GroupFormControl
                    errors={errors}
                    controls={{
                        type: "text",
                        name: "surname",
                        placeholder: "Фамилия",
                        ref: register({
                            required: true
                        })
                    }}
                />
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
                <input type="submit" value="Продолжить регестрацию" className="btn btn-success btn-bn w-100"/>
            </Form>
        </div>
    )
};

export default withRouter(ContinueRegistration);
