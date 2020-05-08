import React from 'react';
import {withGetData} from '../../hoc-helpers';
import {Col, Form, Row} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';


import {connect} from "react-redux";
import {getUser, setRegError} from "../../../actions";
import UserRegOptions from "../../user-reg-options";
import BreederRegOptions from "../../breeder-reg-options";
import {Redirect} from "react-router";
import {HandelError} from "../../handels";


const RegPage = ({ postRegister, getUser, setRegError, isLogin, regError, location }) => {

    const { state } = location;

    const defaultValues = {
        name: '',
        surname: '',
        email: '',
        isBreeder: false,
        password: ''
    };

    if(state){
        defaultValues.name = state.name;
        defaultValues.surname = state.surname;
        defaultValues.email = state.email;
    }

    const { register, handleSubmit, setValue, watch, errors } = useForm({
        defaultValues: defaultValues
    });

    const reg = (data) => {
        const isBreeder = data.isBreeder === 'true';
        console.log({...data, isBreeder});
        postRegister({...data, isBreeder: isBreeder})
            .then( () => {
                getUser();
            })
            .catch( error => {
                console.log(error.response.data);
                setRegError({errors: error.response.data.errors, status: error.status});
            });
    };

    const handleChange = (e) => {
        e.persist();
        setValue(e.target.name, e.target.value);
    };

    const { name, surname, email, password, isBreeder } = watch();

    const regExp = new RegExp(password);

    return (
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

                        {
                            isLogin ?
                                <Redirect to="/"/>
                                : null
                        }
                    </Form>
                </div>
            </Col>
        </Row>
    );
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
        RegPage,
        mapMethodsToProps
    )
);
