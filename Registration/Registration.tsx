import React, {FC} from "react";
import Spinner from "../components/spinner";
import {HandleError} from "../components/Form";
import {Form, Col, Row, Container} from "react-bootstrap";
import {connect} from "react-redux";
import {useRouter} from "next/router";
import Head from "next/head";
import {Formik, Form as FormikForm, Field, FormikProps, ErrorMessage} from "formik";
import {UserRegistrationOptions} from "./components/UserRegistrationOptions";
import {IRegistrationStateProps, RegistrationPropsType} from "./types";
import {registration} from "../redux/Auth";
import {IRootState} from "../redux/store";
import {FormErrorMessage} from "../components/Form/components/FormErrorMessage";
import * as Yup from "yup";
import {BreederRegistrationOptions} from "./components/BreederRegistrationOptions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {FormRadio} from "../components/Form/components/FormRadio";
import {IRegistrationData} from "../types";

const RegistrationComponent: FC<RegistrationPropsType> = (props) => {
    const router = useRouter();
    const {documents, loginRequest, regError, countries, registration} = props;

    const initialValues: IRegistrationData = {
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        is_breeder: false,
        password: '',
        password_confirmation: '',
        user_accepted: false,
        //Breeder options
        company_name: '',
        country: countries.all[0].name,
        phone: '',
        location: '',
        website: '',
        vk: '',
        instagram: '',
        facebook: '',
        youtube: '',
        description: '',
        policity: ''
    };

    if(router.query){
        initialValues.name = router.query.name ? String(router.query.name) : '';
        initialValues.surname = router.query.surname ? String(router.query.surname) : '';
        initialValues.email = router.query.email ? String(router.query.email) : '';
    }

    const onSubmit = (data: IRegistrationData) => {
        registration(data);
    };

    return (
        <Container className="body-second-container">
            <Head>
                <title>Регистрация | Breeders Zone</title>
                <meta name="description" content="Breeders Zone это маркетплейс где вы можете бысто найти и продать животное, больше никаних групп и форумов, все в одном месте"/>
            </Head>
            <Row>
                <Col xs={12} md={8} className="m-auto">
                    <div className="reg form-container">
                        <h1 className="mb--10">Регистрация:</h1>
                        <HandleError error={regError}/>
                        <Formik
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .required('Имя не указанно'),
                                surname: Yup.string()
                                    .required('Фамия не указанна'),
                                patronymic: Yup.string()
                                    .required('Отчество не указанно'),
                                email: Yup.string()
                                    .required('Электронная почта должна быть указанна')
                                    .email('Электронная почта введена не парвильно'),
                                is_breeder: Yup.boolean()
                                    .oneOf([true, false], 'Пожалуйста укажите, кем вы регестрируетесь'),
                                password: Yup.string()
                                    .min(8, 'Пароль должен состоять из 8 символов')
                                    .required('Пароль должен быть указан'),
                                password_confirmation: Yup.string()
                                    .required('Пароли не совпадают')
                                    .oneOf([Yup.ref('password'), ''], 'Пароли не совпадают'),
                                user_accepted: Yup.boolean()
                                    .oneOf([true], 'Вы не можете зарегестрироваться, если не приняли условия'),
                                company_name: Yup.string()
                                    .when("is_breeder", {
                                        is: true,
                                        then: Yup.string().required('Название компании не указанно')
                                    }),
                                country: Yup.string()
                                    .when("is_breeder", {
                                        is: true,
                                        then: Yup.string().required('Старана не указанна')
                                    }),
                                phone: Yup.string()
                                    .when("is_breeder", {
                                        is: true,
                                        then: Yup.string().required('Телефон не указан')
                                    }),
                                location: Yup.string()
                                    .when("is_breeder", {
                                        is: true,
                                        then: Yup.string().required('Локация не указанна')
                                    }),
                                policity: Yup.string()
                                    .when("is_breeder", {
                                        is: true,
                                        then: Yup.string().required('Политика магазина не указанна')
                                    }),
                            })}
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                        >
                            {
                                (props: FormikProps<IRegistrationData>) => {
                                    if (loginRequest) {
                                        return <div className="pb--20">
                                            <Spinner/>
                                        </div>
                                    }

                                    return (
                                        (
                                            <FormikForm>
                                                <UserRegistrationOptions/>

                                                <Form.Group>
                                                    <div>
                                                        <span>Вы регестрируетесь как:</span>
                                                        <span className="nec">*</span>
                                                        <span className="info">
                                                    <FontAwesomeIcon icon={faQuestionCircle}/>
                                                    <p className="info-text">Вы всегда можете изменить это в настройках профиля</p>
                                                </span>
                                                    </div>
                                                    <Field id="is_breederFalse" name="is_breeder" value={false} label="Покупатель" component={FormRadio} />
                                                    <Field id="is_breederTrue" name="is_breeder" value={true} label="Разводчик/Магазин" component={FormRadio} />
                                                    <ErrorMessage name="is_breeder" component={FormErrorMessage}/>
                                                </Form.Group>

                                                {
                                                    props.values.is_breeder &&
                                                    <BreederRegistrationOptions {...props}/>
                                                }
                                                {
                                                    documents.agree.length > 0 ?
                                                        <Form.Group className="d-flex w-100">
                                                            <Form.Check
                                                                id="user_accepted"
                                                                className="mr--5"
                                                                type="checkbox"
                                                                name="user_accepted"
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                            />
                                                            <Form.Label className="w-75" htmlFor="user_accepted">
                                                                Я ознокомился и принимаю {' '}
                                                                {
                                                                    documents.agree.map((item, idx) => (
                                                                        <React.Fragment key={item.label}>
                                                                            <a href={`/documents/${item.label}`}>{item.title}</a>{idx + 1 !== documents.agree.length ? ', ' : ''}
                                                                        </React.Fragment>
                                                                    ))
                                                                }
                                                                <ErrorMessage name="user_accepted" component={FormErrorMessage}/>
                                                            </Form.Label>
                                                        </Form.Group>
                                                        : null
                                                }
                                                <button type="submit" className="btn btn-main">Зарегистрироваться</button>
                                            </FormikForm>
                                        )
                                    )
                                }
                            }
                        </Formik>

                    </div>
                </Col>
            </Row>
        </Container>
    )
};


const mapStateToProps = ({auth: {isLogin, loginRequest, regError}, documents, countries}: IRootState): IRegistrationStateProps => ({
    isLogin,
    loginRequest,
    regError,
    documents,
    countries
});

const Registration = connect(mapStateToProps, {registration})(RegistrationComponent);
export {
    Registration
}
