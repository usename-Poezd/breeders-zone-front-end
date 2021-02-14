import React, {FC, FormEvent, useState} from "react";
import {Alert, Col, Form, Modal, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {connect} from "react-redux";
import {logout, setUser} from "../../../redux/Auth";
import {
    setProfileUpdateError,
    setProfileUpdateSuccess
} from "../../../redux/Profile";
import Spinner from "../../../components/spinner";
import {HandelSuccess, HandelError} from "../../../components/handels";
import {useRouter} from "next/router";
import LazyImg from "../../../components/lazy-img";
import Link from "next/link";
import {IRootState} from "../../../redux/store";
import {Formik, Form as FormikForm, Field, FormikProps} from "formik";
import {IInitialsValues, IUserProfileStateProps, UserProfilePropsType} from "./types";
import {useDataService} from "../../../hooks";
import {FormInput, FormDropzone, FormTextArea} from "../../../components/Form";
import {FormikHelpers} from "formik/dist/types";
import {IUser} from "../../../types";
import * as Yup from "yup";

const UserProfileComponent: FC<UserProfilePropsType> = (props) => {
    const {
        user,
        profile,
        setProfileUpdateSuccess,
        setProfileUpdateError,
        loginRequest,
        isLogin,
        logout,
        setUser
    } = props;
    const {updateProfile, deleteProfile} = useDataService();
    const router = useRouter();
    const [modalShow, setModalShow] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState(false);

    if (!isLogin && typeof window !== 'undefined') {
        router.push('/login');
    }

    if (isLogin && loginRequest) {
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    const initialValues: IInitialsValues = {
        name: user && user.name || '',
        surname: user && user.surname || '',
        patronymic: user && user.patronymic || '',
        about: user && user.about || '',
        email: user && user.email || '',
        profile_imgPreviews: [],
        password: '',
        old_password: '',
        password_confirmation: ''
    };


    const submitUpdate = (data: IInitialsValues, actions: FormikHelpers<IInitialsValues>) => {
        const id = (user as IUser).id;

        updateProfile(id, {
                ...data,
                change_password: changePassword,
            })
            .then( ({message, data}) => {
                setProfileUpdateSuccess(String(message));
                setUser(data);
                actions.setFieldValue('name', data.name);
                actions.setValues({
                    name: data.name,
                    surname: data.surname,
                    patronymic: data.patronymic,
                    about: data.about ? data.about : '',
                    email: data.email,
                    profile_imgPreviews: [],
                    password: '',
                    old_password: '',
                    password_confirmation: ''
                });
                actions.setSubmitting(false);
            })
            .catch( error => {
                setProfileUpdateError({errors: error.response.data.errors, status: error.status});
                actions.setSubmitting(false);
            });
    };

    const deleteProfileSubmit = (e: FormEvent) => {
        e.preventDefault();

        setDeleteRequest(true);
        deleteProfile((user as IUser).id)
            .then(() => {
                logout(true);
                router.push('/');
            })
            .catch(() => {
                setDeleteError(true);
                setDeleteRequest(false);
            })
    };

    const { update } = profile;

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={8}>
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
                        password: Yup.string()
                            .min(8, 'Пароль должен состоять из 8 символов')
                            .required('Пароль должен быть указан'),
                        old_password: Yup.string()
                            .required('Старый пароль должен быть указан'),
                        password_confirmation: Yup.string()
                            .required('Пароли не совпадают')
                            .oneOf([Yup.ref('password'), ''], 'Пароли не совпадают'),
                    })}
                    initialValues={initialValues}
                    onSubmit={submitUpdate}
                >
                    {
                        ({isSubmitting}: FormikProps<IInitialsValues>) => {
                            if (isSubmitting) {
                                return (
                                    <div className="form-container d-flex justify-content-center w-100">
                                        <div className="mt-3 py-5">
                                            <Spinner/>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <FormikForm className="form-container">
                                    <HandelSuccess success={update.success}/>
                                    <HandelError error={update.error}/>
                                    <Field id="name" name="name" required label="Имя" placeholder="Ваше имя" component={FormInput} />
                                    <Field id="surname" name="surname" required label="Фамилия" placeholder="Ваша фамилия" component={FormInput} />
                                    <Field id="patronymic" name="patronymic" required label="Отчество" placeholder="Ваше отчество" component={FormInput} />
                                    <Field id="email" name="email" required label="Электронная почта" placeholder="Ваша электронная почта" component={FormInput} />
                                    <Row className="mb--10">
                                        <Col xs={12} md={8} className="w-100 d-flex align-content-stretch w-100">
                                            <Field name="profile_img" component={FormDropzone} />
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <div className="shop-logo-preview">
                                                {
                                                    user && user.profile_img ?
                                                        <LazyImg src={user.profile_img} alt="preview" className="img-fluid"/> :
                                                        <span>Вы пока не загрузили ваше фото</span>
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Field id="about" name="about" label="О себе" component={FormTextArea}/>
                                    <Row>
                                        <Col xs={12} md={9}>
                                            <div className="feather-shadow p-2 mb-3 change-password">
                                                {
                                                    changePassword ?
                                                        (
                                                            <div>
                                                                <Field id="old_password" name="oldPassword" required label="Старый пароль" component={FormInput} />
                                                                <Field id="password" name="password" required label="Новый пароль" component={FormInput} />
                                                                <Field id="password_confirmation" name="password_confirmation" required label="Подтвердите пароль" component={FormInput} />
                                                            </div>
                                                        )
                                                        :   <span>Пароль</span>

                                                }

                                                <span onClick={() => setChangePassword(!changePassword)} className="change-btn color-primary btn-link">
                                        {
                                            changePassword ?
                                                'Отмена'
                                                : 'Изменить'
                                        }
                                    </span>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            {
                                                user && !user?.is_breeder ?
                                                    <Field id="is_breeder" name="is_breeder" required label="Стать разводчиком"component={FormInput} />
                                                    : <Link href="/profile/shop">
                                                        <a>
                                                            Профиль магазина
                                                        </a>
                                                    </Link>
                                            }
                                        </Col>
                                    </Row>
                                    <button type="submit" className="btn btn-main">Зарегистрироваться</button>
                                </FormikForm>
                            )
                        }
                    }
                </Formik>
            </Col>
            <Col xs={12} md={8}>
                <div className="form-container border border-danger" style={{marginBottom: 20}}>
                    <h2 className="text-center">Опасная зона</h2>
                    <Modal show={modalShow} onHide={() => setModalShow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Удаление профиля</Modal.Title>
                        </Modal.Header>
                        <Modal.Body as={Form}  onSubmit={deleteProfileSubmit}>
                            {
                                !deleteRequest ?
                                    (
                                        <React.Fragment>
                                            {
                                                deleteError ?
                                                    <Alert variant="danger">
                                                        <p>Произошла ошибка, попробуйте еще раз.</p>
                                                    </Alert>
                                                    : null
                                            }
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3>Вы действительно хотите удалить профиль?</h3>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalShow(false)}
                                                        className="btn"
                                                    >Нет</button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-danger"
                                                    >Да</button>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                    : (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <BootstrapSpinner animation="border" className="m-auto"/>
                                        </div>
                                    )
                            }
                        </Modal.Body>
                    </Modal>
                    <Form.Group>
                        <button
                            type="button"
                            onClick={() => setModalShow(true)}
                            className="btn btn-danger"
                        >Удалить профиль</button>
                    </Form.Group>
                </div>
            </Col>
        </Row>
    );
};

const mapStateToProps = ({profile, auth: {loginRequest, isLogin}}: IRootState): IUserProfileStateProps => ({
    user: profile.user,
    loginRequest,
    isLogin,
    profile
});

const UserProfile =  connect(mapStateToProps, {
    setProfileUpdateSuccess,
    setProfileUpdateError,
    setUser,
    logout
})(
    UserProfileComponent
);

export {
    UserProfile
}
