import React, { Component } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { withHookForm } from '../hoc-helpers';
import GroupFormConrol from "../group-form-control";
import Router from 'next/router'

class ContinueRegistration extends Component {

    state = {
        regName: '',
        regSurname: '',
        regEmail: '',
        isReg: false
    };


    checkRedirect = () => {
        if(this.state.isReg){
            Router.push('/registration')
        }
    };

    registerContinue = data => {
        this.setState({
            regName: data.name,
            regSurname: data.surname,
            regEmail: data.email,
            isReg: true
        });
    };

    render(){
        const { register, handleSubmit, watch, errors } = this.props;

        return (
            <div className="reg form-container">
                <h2 className="form-container-title">Впервые на Breeders Zone?</h2>
                <Form onSubmit={handleSubmit(this.registerContinue)} className="form login-form">
                    <GroupFormConrol
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
                    <GroupFormConrol
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
                    <GroupFormConrol
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
                    {this.checkRedirect()}
                </Form>
            </div>
        )
    }
}

export default withHookForm(ContinueRegistration, useForm);
