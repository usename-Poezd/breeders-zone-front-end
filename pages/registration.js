import React, {useState} from "react";
import Header from "../components/header/header";
import Spinner from "../components/spinner";
import {HandelError} from "../components/handels";
import UserRegOptions from "../components/user-reg-options";
import BreederRegOptions from "../components/breeder-reg-options";
import {Form, Col, Row, Container} from "react-bootstrap";
import {withGetData} from '../components/hoc-helpers';
import {useForm} from 'react-hook-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {getUser, setRegError} from "../actions";
import {connect} from "react-redux";
import Router from "next/router";

const Registration = ({ postRegister, getUser, setRegError, isLogin, regError, location }) => {
    // const { state } = location;

    const defaultValues = {
        name: '',
        surname: '',
        email: '',
        isBreeder: false,
        password: ''
    };

    const [registerRequest, setRegisterRequest] = useState(false);

    // if(state){
    //     defaultValues.name = state.name;
    //     defaultValues.surname = state.surname;
    //     defaultValues.email = state.email;
    // }

    const { register, handleSubmit, setValue, watch, errors } = useForm({
        defaultValues: defaultValues
    });

    const reg = (data) => {
        const isBreeder = data.isBreeder === 'true';
        setRegisterRequest(true);
        postRegister({...data, isBreeder: isBreeder})
            .then( () => {
                Router.push("/");
                getUser();
            })
            .catch( error => {
                setRegisterRequest(false);
                setRegError({errors: error.response.data.errors, status: error.status});
            });
    };

    const handleChange = (e) => {
        e.persist();
        setValue(e.target.name, e.target.value);
    };

    const { name, surname, email, password, isBreeder } = watch();

    const regExp = new RegExp(password);

    if (registerRequest) {
        return (
            <Container>
                <Row>
                    <Col xs={12} md={8} className="m-auto">
                        <Spinner/>
                    </Col>
                </Row>
            </Container>
        )
    }


    return (
            <Container>
                <Row>
                    <Col xs={12} md={8} className="m-auto">
                        <div className="reg form-container">
                            <HandelError error={regError}/>
                            <Form onSubmit={handleSubmit(reg)}>

                                <UserRegOptions
                                    register={register}
                                    onChange={(e) => handleChange(e)}
                                    errors={errors}
                                    regExp={regExp}
                                    name={name}
                                    surname={surname}
                                    email={email}
                                />

                                <Form.Group>
                                    <Form.Label className="nec">
                                        Вы регестрируетесь как:
                                        <span className="info">
                                    <FontAwesomeIcon icon={faQuestionCircle}/>
                                    <p className="info-text">Вы всегда можете сменить это в настройках профиля</p>
                                </span>
                                    </Form.Label>
                                    <Form.Check
                                        type="radio"
                                        name="isBreeder"
                                        value={true}
                                        onChange={(e) => handleChange(e)}
                                        label="Разводчик"
                                        ref={register({ required: true })}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="isBreeder"
                                        value={false}
                                        onChange={(e) => handleChange(e)}
                                        label="Покупатель"
                                        ref={register({ required: true })}
                                    />
                                </Form.Group>

                                {
                                    isBreeder === 'true' ?
                                        <BreederRegOptions
                                            register={register}
                                            errors={errors}
                                        />
                                        : null
                                }

                                <input type="submit" value="Зарегестрироваться" className="btn btn-main"/>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
    )
};

const mapMethodsToProps = (getData) => ({
    postRegister: getData.postRegister
});

const mapStateToProps = ({auth: {isLogin, regError}}) => ({
    isLogin,
    regError
});


export default connect(mapStateToProps, {setRegError, getUser})(
    withGetData(
        Registration,
        mapMethodsToProps
    )
);