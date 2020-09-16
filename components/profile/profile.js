import React, {useCallback, useEffect, useState} from "react";
import {Alert, Col, Form, Modal, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {withGetData} from "../hoc-helpers";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {
    clearProfileState, deleteProductPreview,
    getUser, logout, profileUpdateRequest,
    setProfileChangePassword, setProfilePreview,
    setProfileUpdateError,
    setProfileUpdateSuccess
} from "../../actions";
import Spinner from "../spinner";
import {HandelSuccess} from "../handels";
import HandelError from "../handels/handel-error";
import {useDropzone} from "react-dropzone";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import LazyImg from "../lazy-img";
import Link from "next/link";

const Profile = ({
     updateProfile,
     getUser,
     user,
     setProfileChangePassword,
     profile,
     setProfileUpdateSuccess,
     setProfileUpdateError,
     clearProfileState,
     profileUpdateRequest,
     setProfilePreview,
     deleteProductPreview,
     loginRequest,
     isLogin,
     deleteProfile,
     logout
}) => {
    const router = useRouter();
    const [modalShow, setModalShow] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState(false);

    if (!isLogin && typeof window !== 'undefined') {
        router.push('/login');
    }

    const { register, handleSubmit, watch, setValue, errors } = useForm({
        defaultValues: {
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            about: user.about ? user.about : '',
            email: user.email,
            password: '',
            oldPassword: '',
            confirmPassword: ''
        }
    });

    const handleChange = (e) => {
        e.persist();
        setValue(e.target.name, e.target.value);
    };

    const clearProperty = () => {
        setValue('password', '');
        setValue('oldPassword', '');
        setValue('confirmPassword', '');
    };

    const submitUpdate = (data) => {
        const { id } = user;
        const { changePassword } = profile;

        profileUpdateRequest();


        updateProfile(id, {
                ...data,
                changePassword,
                profile_img: acceptedFiles[0]
            })
            .then( data => {
                clearProperty();
                getUser()
                    .then( (user) =>{
                        setProfileUpdateSuccess(data.success);
                        setTimeout(()=> clearProfileState(), 5000);
                        setValue('name', user.name);
                        setValue('surname', user.surname);
                        setValue('patronymic', user.patronymic);
                        setValue('email', user.email);
                    });
            })
            .catch( error => {
                setProfileUpdateError({errors: error.response.data.errors, status: error.status});
                acceptedFiles.splice(0, acceptedFiles.length);
                setTimeout(()=> clearProfileState(), 5000);
            });
    };

    const deleteProfileSubmit = (e) => {
        e.preventDefault();

        setDeleteRequest(true);
        deleteProfile(user.id)
            .then(() => {
                logout(true);
                router.push('/');
            })
            .catch(() => {
                setDeleteError(true);
                setDeleteRequest(false);
            })
    };

    const {
        name,
        surname,
        patronymic,
        oldPassword,
        confirmPassword,
        password,
        email
    } = watch();

    const { changePassword, update } = profile;


    const regExp = new RegExp(password);

    const onDrop = useCallback(acceptedFiles => {
        const preview = [];

        acceptedFiles.map( (item) => preview.push(URL.createObjectURL(item)));

        setProfilePreview(preview);
    }, []);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDrop: onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png'
    });

    if(loginRequest || profile.update.request){
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={8}>
                <Form className="form-container" onSubmit={handleSubmit(submitUpdate)}>
                    <HandelSuccess success={update.success}/>
                    <HandelError error={update.error}/>
                    <GroupFormControl
                        label="Имя"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "name",
                            placeholder: "Ваше имя",
                            value: name,
                            onChange: handleChange,
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <GroupFormControl
                        label="Фамилия"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "surname",
                            placeholder: "Ваша фамилия",
                            value: surname,
                            onChange: handleChange,
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <GroupFormControl
                        label="Отчество"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "patronymic",
                            value: patronymic,
                            placeholder: "Ваше отчество",
                            onChange: handleChange,
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <GroupFormControl
                        label="Электронная почта"
                        errors={errors}
                        controls={{
                            type: "email",
                            name: "email",
                            value: email,
                            placeholder: "mymail123@mail.com",
                            onChange: handleChange,
                            ref: register({
                                required: true,
                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            })
                        }}
                    />

                    <Row className="drag-and-drop">
                        <Col xs={12} md={8} className="w-100 d-flex align-content-stretch w-100">
                            <div {...getRootProps({ className: 'drag-and-drop-container w-100 m-0 h-100 feather-shadow'})}>
                                <input {...getInputProps({
                                    name: 'logo',
                                    className: 'drag-and-drop-input'
                                })}/>
                                <div className="d-flex outline h-100">
                                    {
                                        acceptedFiles[0] ?
                                            update.previews.map( (item, idx) => (
                                                <div className="preview">
                                                    <span
                                                        className="preview-delete"
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            acceptedFiles.splice(idx, 1);
                                                            deleteProductPreview(idx)
                                                        }}
                                                    >
                                                    <FontAwesomeIcon icon={faTimes} size="sm"/>
                                                </span>
                                                    <LazyImg src={item} alt={`prew-${idx}`} key={`prew-${idx}`} className="img-fluid"/>
                                                </div>
                                            ))
                                            : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="shop-logo-preview">
                                {
                                    user.profile_img ?
                                        <LazyImg src={user.profile_img} alt="preview" className="img-fluid"/> :
                                        <span>Вы пока не загрузили ваш логотип</span>
                                }
                            </div>
                        </Col>
                    </Row>

                    <GroupFormControl
                        label="О себе"
                        textArea = {true}
                        errors = {errors}
                        controls={{
                            type: "text",
                            name: "about",
                            ref: register
                        }}
                    />

                    <Row>
                        <Col xs={12} md={9}>
                            <div className="feather-shadow p-2 mb-3 change-password">
                                {
                                    changePassword ?
                                        (
                                            <div>
                                                <GroupFormControl
                                                    label="Старый пароль"
                                                    errors={errors}
                                                    controls={{
                                                        type: "password",
                                                        name: "oldPassword",
                                                        placeholder: "",
                                                        value: oldPassword,
                                                        onChange: handleChange,
                                                        ref: register({
                                                            required: true
                                                        })
                                                    }}
                                                />
                                                <GroupFormControl
                                                    label="Новый пароль"
                                                    errors={errors}
                                                    controls={{
                                                        type: "password",
                                                        name: "password",
                                                        placeholder: "",
                                                        value: password,
                                                        onChange: handleChange,
                                                        ref: register({
                                                            required: true
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
                                                        value: confirmPassword,
                                                        onChange: handleChange,
                                                        ref: register({
                                                            required: true,
                                                            pattern: regExp
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )
                                        :   <span>Пороль</span>

                                }

                                <span onClick={setProfileChangePassword} className="change-btn color-main btn-link">
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
                                !user.is_breeder ?
                                    <Form.Group className="d-flex">
                                        <Form.Check
                                            id="is_breeder"
                                            name="is_breeder"
                                            ref={register}
                                        />
                                        <Form.Label htmlFor="is_breeder" style={{lineHeight: 1}}>Стать разводчиком</Form.Label>
                                    </Form.Group>
                                    : <Link href="/profile/shop">
                                        <a>
                                            Профиль магазина
                                        </a>
                                    </Link>
                            }
                        </Col>
                    </Row>
                    <input type="submit" value="Сохранить" className="btn btn-main"/>
                </Form>
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
    )

};

const mapMethodsToProps = ({updateProfile, deleteProfile}) => ({
    updateProfile,
    deleteProfile
});

const mapStateToProps = ({profile, auth: {loginRequest, isLogin}}) => ({
    user: profile.user,
    loginRequest,
    isLogin,
    profile
});

export default connect(mapStateToProps, {
    getUser,
    setProfileChangePassword,
    setProfileUpdateSuccess,
    setProfileUpdateError,
    clearProfileState,
    profileUpdateRequest,
    setProfilePreview,
    deleteProductPreview,
    logout
})(
    withGetData(
        Profile,
        mapMethodsToProps
    )
);
