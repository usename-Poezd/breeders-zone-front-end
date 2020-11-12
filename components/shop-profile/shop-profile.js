import React, {useCallback, useState} from "react";
import {Col, Form, Modal, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {Controller, useForm} from "react-hook-form";
import {connect} from "react-redux";
import Spinner from "../spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faPen, faTruck} from "@fortawesome/free-solid-svg-icons";
import {useDropzone} from "react-dropzone";
import {withDataService} from "../../HOC";
import {
    getUser,
    setShopPreview,
    setShopUpdateError,
    setShopUpdateRequest,
    setShopUpdateSuccess,
    shopUpdateClear
} from "../../redux/actions";
import {HandelSuccess} from "../handels";
import HandelError from "../handels/handel-error";
import {useRouter} from "next/router";
import LazyImg from "../lazy-img";
import InputMask from "react-input-mask";
import ImageCrop from "../image-crop";

const ShopProfile = ({user, getUser, updateShop, setShopUpdateRequest, shopUpdateClear, setShopUpdateSuccess, setShopUpdateError, shop, setShopPreview, isLogin, countries, loginRequest}) => {

    const router = useRouter();

    if((shop.update.request || loginRequest) && isLogin){
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
        router.push('/');
    }

    const { register, handleSubmit, watch, setValue, control, errors } = useForm({
        defaultValues: {
            ...user,
            country: user.country ? user.country.name : countries.all[0].name,
            description: user.description ? user.description : '',
            policity: user.policity ? user.policity : '',
            vk: user.vk ? user.vk : '',
            facebook: user.facebook ? user.facebook : '',
            instagram: user.instagram ? user.instagram : '',
            youtube: user.youtube ? user.youtube : '',
            website: user.website ? user.website : ''
        }
    });

    const onDrop = useCallback(acceptedFiles => {
        const preview = [];

        acceptedFiles.map( (item) => preview.push(URL.createObjectURL(item)));

        setShopPreview(preview);
    }, []);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDrop: onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png'
    });



    const submitUpdate = (data) => {
        const { company_name } = user;

        setShopUpdateRequest();
        updateShop(company_name, { ...data})
            .then( data => {
                getUser()
                    .then( () => {
                        setShopUpdateSuccess(data.success);
                        setTimeout(()=> shopUpdateClear(), 5000);
                    })
            })
            .catch( (error) => {
                setShopUpdateError({errors: error.response.data.errors, status: error.status});
                setTimeout(()=> shopUpdateClear(), 5000);
            });
    };

    const handleChange = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'local_delivery':
                setValue(e.target.name, !local_delivery);
                break;
            case 'regional_delivery':
                setValue(e.target.name, !regional_delivery);
                break;
            case 'countrywide_delivery':
                setValue(e.target.name, !countrywide_delivery);
                break;
            default:
                setValue(e.target.name, e.target.value);
                break;
        }
    };

    const { logo_img_url } = user;

    const {
        company_name,
        owner,
        local_delivery,
        regional_delivery,
        countrywide_delivery,
        description,
        vk,
        facebook,
        instagram,
        youtube,
        website,
        location,
        country,
    } = watch();

    const countryCallCode = !countries.all.find((item) => item.name === country)?.calling_code ?
        countries.all.find((item) => item.name === user.country.name)?.calling_code
        : countries.all.find((item) => item.name === country)?.calling_code;
    const countryCallCodeMask = countryCallCode?.replace('9', '\\9');

    const { update } = shop;

    const [changeLogo, setChangeLogo] = useState(false);
    const [isImageCrop, setIsImageCrop] = useState(true);

    return (
        <Row className="flex-column flex-column-reverse flex-md-row justify-content-center">
            <Modal show={changeLogo} onHide={() => setChangeLogo(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Загрузка новой фотографии</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isImageCrop &&
                            <ImageCrop
                                aspect={1}
                                onComplete={(corp => {
                                    setShopUpdateRequest();
                                    updateShop(company_name, {logo: corp}, true)
                                        .then(data => {
                                            getUser()
                                                .then(() => {
                                                    setShopUpdateSuccess(data.success);
                                                    setTimeout(() => shopUpdateClear(), 5000);
                                                })
                                        })
                                        .catch((error) => {
                                            setShopUpdateError({errors: error.response.data.errors, status: error.status});
                                            setTimeout(() => shopUpdateClear(), 5000);
                                        });
                                    setIsImageCrop(false);
                                    setChangeLogo(false);
                                })}
                            />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <p className="w-100 text-center">Если у Вас возникают проблемы с загрузкой, попробуйте выбрать фотографию меньшего размера.</p>
                </Modal.Footer>
            </Modal>
            <Col xs={12} md={9}>
                <Form className="form-container" onSubmit={handleSubmit(submitUpdate)} encType="multipart/form-data">
                    <HandelSuccess success={update.success}/>
                    <HandelError error={update.error}/>

                    <GroupFormControl
                        label="Название компании"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "company_name",
                            onChange: handleChange,
                            value: company_name,
                            min: 1,
                            ref: register({
                                required: true,
                                minLength: 1
                            })
                        }}
                    />
                    <GroupFormControl
                        label="Владелец"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "owner",
                            onChange: handleChange,
                            value: owner,
                            ref: register()
                        }}
                    />
                    <Form.Group className="d-flex flex-column locality">
                        <Form.Label htmlFor="country">Укажите страну:</Form.Label>
                        <div className="select-wrap w-100">
                            <Form.Control
                                id="country"
                                as="select"
                                name="country"
                                value={country ? country : user.country?.name}
                                onChange={(e) => setValue(e.target.value)}
                                ref={
                                    register({
                                        required: true
                                    })
                                }
                            >
                                {
                                    countries.all.map((item, idx) => <option key={idx} value={item.name}>{item.name}</option>)
                                }
                            </Form.Control>
                        </div>
                        {
                            errors.country &&
                            errors.country.type === 'required' &&
                            <p className="form-err text-danger">Пожалуйста укажите страну`</p>
                        }
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Телефон:</Form.Label>
                        <Controller
                            as={InputMask}
                            mask={`+${countryCallCodeMask} 999 999 99 99`}
                            maskPlaceholder={null}
                            placeholder={`+${countryCallCodeMask} 999 999 99 99`}
                            control={control}
                            name="phone"
                            type="tel"
                            className="form-control"
                            rules={{
                                required: true,
                                pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
                            }}
                        />
                        {   errors['phone'] &&
                        errors['phone'].type === 'required' &&
                        <p className="form-err text-danger">Пожалуйста заполните это поле</p>
                        }
                        {   errors['phone'] &&
                        errors['phone'].type === 'pattern' &&
                        <p className="form-err text-danger">Пожалуйста заполните это поле правильно</p>
                        }
                    </Form.Group>
                    <GroupFormControl
                        label="Локация"
                        errors = {errors}
                        controls={{
                            type: "text",
                            name: "location",
                            value: location,
                            onChange: handleChange,
                            ref: register({
                                required: true,
                            })
                        }}
                    />

                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            name="local_delivery"
                            id="local_delivery"
                            onChange={handleChange}
                            label={
                                (
                                    <div className="d-flex">
                                        <FontAwesomeIcon icon={faCar} size="lg" className={"mr-1 " + ( local_delivery ? '' : 'disabled')}/>
                                        <p>Локальная</p>
                                    </div>
                                )
                            }
                            ref={register}
                        />
                        <Form.Check
                            type="checkbox"
                            name="regional_delivery"
                            id="regional_delivery"
                            onChange={handleChange}
                            label={
                                (
                                    <div className="d-flex">
                                        <FontAwesomeIcon icon={faTruck} size="lg" className={"mr-1 " + ( regional_delivery ? '' : 'disabled')}/>
                                        <p>Региональная</p>
                                    </div>
                                )
                            }
                            ref={register}
                        />
                        <Form.Check
                            type="checkbox"
                            name="countrywide_delivery"
                            id="countrywide_delivery"
                            onChange={handleChange}
                            label={
                                (
                                    <div className="d-flex">
                                        <FontAwesomeIcon icon={faHelicopter} size="lg" className={"mr-1 " + ( countrywide_delivery ? '' : 'disabled')}/>
                                        <p>Международная</p>
                                    </div>
                                )
                            }
                            ref={register}
                        />
                    </Form.Group>

                    <GroupFormControl
                        label="Описание магазина"
                        textArea = {true}
                        errors = {errors}
                        controls={{
                            type: "text",
                            name: "description",
                            value: description,
                            onChange: handleChange,
                            ref: register()
                        }}
                    />

                    <GroupFormControl
                        label="Политика магазина"
                        info={{
                            isInfo: true,
                            text: "Здесь в должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)"
                        }}
                        textArea = {true}
                        errors = {errors}
                        value={description}
                        controls={{
                            type: "text",
                            name: "policity",
                            min: 1,
                            ref: register({
                                required: true,
                                minLength: 1
                            })
                        }}
                    />

                    <GroupFormControl
                        label="Сайт"
                        errors = {errors}
                        controls={{
                            type:"text",
                            name:"website",
                            value: website,
                            onChange: handleChange,
                            ref: register({
                                pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                            }),
                        }}
                    />
                    <Row>
                        <Col xs={12} md={3}>
                            <GroupFormControl
                                label="Вконтакте"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "vk",
                                    value: vk,
                                    onChange: handleChange,
                                    ref: register({
                                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                    }),
                                }}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <GroupFormControl
                                label="Instagram"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "instagram",
                                    value: instagram,
                                    onChange: handleChange,
                                    ref: register({
                                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                    }),
                                }}
                            />
                        </Col>

                        <Col xs={12} md={3}>
                            <GroupFormControl
                                label="Facebook"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "facebook",
                                    value: facebook,
                                    onChange: handleChange,
                                    ref: register({
                                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                    }),
                                }}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <GroupFormControl
                                label="Youtube канал"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "youtube",
                                    value: youtube,
                                    onChange: handleChange,
                                    ref: register({
                                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                    }),
                                }}
                            />
                        </Col>
                    </Row>



                    <input type="submit" value="Сохранить" className="btn btn-main"/>
                </Form>
            </Col>
            <Col xs={12} md={3}>
                <div className="feather-shadow form-container">
                    <Row>
                        <Col xs={12}>
                            <h3 className="mb--5">Ваш логотип:</h3>
                            <div className="shop-logo-preview">
                                <span className="edit" onClick={() => setChangeLogo(true)}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </span>
                                {
                                    logo_img_url ?
                                        <LazyImg src={logo_img_url} alt="preview" className="img-fluid"/> :
                                        <span>Вы пока не загрузили ваш логотип</span>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    )
};

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, shop, countries}) => ({
    user,
    shop,
    isLogin,
    countries,
    loginRequest
});

const mapMethodsToProps = (getData) => ({
    updateShop: getData.updateShop
});

export default connect(mapStateToProps, { getUser, setShopUpdateRequest, setShopUpdateSuccess, shopUpdateClear, setShopUpdateError, setShopPreview })( withDataService(ShopProfile, mapMethodsToProps));
