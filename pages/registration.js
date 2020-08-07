import React, {useState} from "react";
import Spinner from "../components/spinner";
import {HandelError} from "../components/handels";
import UserRegOptions from "../components/user-reg-options";
import BreederRegOptions from "../components/breeder-reg-options";
import {Form, Col, Row, Container} from "react-bootstrap";
import {withGetData} from '../components/hoc-helpers';
import {useForm} from 'react-hook-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {getUser, setAgreeDocuments, setCountries, setRegError} from "../actions";
import {connect} from "react-redux";
import Router, {withRouter} from "next/router";
import wrapper from "../store";
import {DataService} from "../services";
import Head from "next/head";
import nookies from "nookies";

const Registration = ({ postRegister, getUser, setRegError, isLogin, regError, router: {query}, documents }) => {

    if (isLogin && typeof window !== 'undefined') {
        Router.push('/');
    }
    const defaultValues = {
        name: '',
        surname: '',
        email: '',
        isBreeder: false,
        password: ''
    };

    const [registerRequest, setRegisterRequest] = useState(false);

    if(query){
        defaultValues.name = query.name;
        defaultValues.surname = query.surname;
        defaultValues.email = query.email;
    }

    const { register, handleSubmit, setValue, watch, errors } = useForm({
        defaultValues: defaultValues
    });

    const reg = (data) => {
        const isBreeder = data.isBreeder === 'true';
        setRegisterRequest(true);
        postRegister({...data, isBreeder: isBreeder})
            .then( () => {
                Router.push("/verify");
            })
            .catch( error => {
                setRegisterRequest(false);
                setRegError({errors: error.response.data.errors, status: error.response.status});
                setTimeout(() => setRegError({errors: null, status: null}), 3000)
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
            <Container className="body-second-container">
                <Row>
                    <Col xs={12} md={8} className="m-auto">
                        <Spinner/>
                    </Col>
                </Row>
            </Container>
        )
    }


    return (
            <Container className="body-second-container">
                <Head>
                    <title>Регистрация | Breeders Zone</title>
                    <meta name="description" content="Breeders Zone это маркетплейс где вы можете бысто найти и продать животное, больше никаних групп и форумов, все в одном месте"/>
                </Head>
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
                                    {   errors['isBreeder'] &&
                                    errors['isBreeder'].type === 'required' &&
                                    <p className="form-err text-danger">Пожалуйста заполните это поле.</p>
                                    }
                                </Form.Group>

                                {
                                    isBreeder === 'true' ?
                                        <BreederRegOptions
                                            register={register}
                                            errors={errors}
                                            watch={watch}
                                        />
                                        : null
                                }

                                {
                                    documents.agree.length > 0 ?
                                        <Form.Group className="d-flex w-100">
                                            <Form.Check
                                                id="user_accepted"
                                                className="mr--5"
                                                type="checkbox"
                                                name="user_accepted"
                                                onChange={handleChange}
                                                ref={register({ required: true })}
                                            />
                                            <Form.Label className="w-75" htmlFor="user_accepted">
                                                Я ознокомился и принимаю условия{' '}
                                                {
                                                    documents.agree.map((item, idx) => (
                                                        <React.Fragment key={item.label}>
                                                            <a href={`/documents/${item.label}`}>{item.morph_rus}</a>{idx + 1 !== documents.agree.length ? ', ' : ''}
                                                        </React.Fragment>
                                                    ))
                                                }
                                                {   errors['user_accepted'] &&
                                                errors['user_accepted'].type === 'required' &&
                                                <p className="form-err text-danger">Вы не можете зарегестрироваться, если не приняли условия</p>
                                                }
                                            </Form.Label>
                                        </Form.Group>
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

const mapStateToProps = ({auth: {isLogin, regError}, documents}) => ({
    isLogin,
    regError,
    documents
});

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    const {store, res} = await ctx;
    if (nookies.get(ctx).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }

    if(store.getState().countries.all.length === 0 && res) {
        const dataService = await new DataService();
        const countries = await dataService.getCountries();
        store.dispatch(setCountries(countries))
    }

    if (store.getState().documents.agree.length === 0 && res) {
        const dataService = await new DataService();
        const documents = await dataService.getDocuments({only_agree: true});
        store.dispatch(setAgreeDocuments(documents))
    }
});

export default connect(mapStateToProps, {setRegError, getUser})(
    withRouter(
        withGetData(
            Registration,
            mapMethodsToProps
        )
    )
);
