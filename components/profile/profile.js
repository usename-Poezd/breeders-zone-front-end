import React, {Component, useCallback} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {withGetData, withHookForm} from "../hoc-helpers";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {
    clearProfileState, deleteProductPreview,
    getUser, profileUpdateRequest,
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
import {isLogin} from "../../utils";
import LazyImg from "../lazy-img";

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
     loginRequest
}) => {

    const router = useRouter();

    if(loginRequest || profile.update.request){
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    if (!isLogin() && typeof window !== 'undefined') {
        router.push('/login');
    }

    const { register, handleSubmit, watch, setValue, errors } = useForm({
        defaultValues: {
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
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
                    .then( () =>{
                        setProfileUpdateSuccess(data.success);
                        setTimeout(()=> clearProfileState(), 5000);
                    });
            })
            .catch( error => {
                setProfileUpdateError({errors: error.response.data.errors, status: error.status});
                acceptedFiles.splice(0, acceptedFiles.length);
                setTimeout(()=> clearProfileState(), 5000);
            });
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

                    <div className="feather-shadow p-2 mb-3 w-75 change-password">
                        {
                            changePassword ?
                                (
                                    <div>
                                        <GroupFormControl
                                            label="Старый пороль"
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
                                            label="Новый пороль"
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
                                            label="Подтвердите пороль"
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



                    <input type="submit" value="Сохранить" className="btn btn-main"/>
                </Form>
            </Col>
        </Row>
    )

};

const mapMethodsToProps = (getData) => ({
    updateProfile: getData.updateProfile
});

const mapStateToProps = ({profile, auth: {loginRequest}}) => ({
    user: profile.user,
    loginRequest,
    profile
});

export default connect(mapStateToProps, { getUser, setProfileChangePassword, setProfileUpdateSuccess, setProfileUpdateError, clearProfileState, profileUpdateRequest, setProfilePreview, deleteProductPreview })(
    withGetData(
        Profile,
        mapMethodsToProps
    )
);
