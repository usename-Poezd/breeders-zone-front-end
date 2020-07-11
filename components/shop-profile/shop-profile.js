import React, {useCallback} from "react";
import {Col, Form, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import Spinner from "../spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import {useDropzone} from "react-dropzone";
import {withGetData} from "../hoc-helpers";
import {
    getUser,
    setShopPreview,
    setShopUpdateError,
    setShopUpdateRequest,
    setShopUpdateSuccess,
    shopUpdateClear
} from "../../actions";
import {HandelSuccess} from "../handels";
import HandelError from "../handels/handel-error";
import {useRouter} from "next/router";
import LazyImg from "../lazy-img";

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

    const { register, handleSubmit, watch, setValue, errors } = useForm({
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
        updateShop(company_name, { ...data, logo: acceptedFiles[0]})
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
        phone,
        description,
        vk,
        facebook,
        instagram,
        youtube,
        website,
        location,
        country
    } = watch();

    const { update } = shop;

    return (
        <Row className="justify-content-center">
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

                    <GroupFormControl
                        label="Телефон"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "phone",
                            onChange: handleChange,
                            value: phone,
                            ref: register({
                                required: true,
                                pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
                            })
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
                                        <p>По всей стране</p>
                                    </div>
                                )
                            }
                            ref={register}
                        />
                    </Form.Group>


                    <Row className="drag-and-drop">
                        <Col xs={12} md={8}>
                            <div {...getRootProps({ className: 'drag-and-drop-container feather-shadow'})}>
                                <input {...getInputProps({
                                    name: 'logo',
                                    className: 'drag-and-drop-input'
                                })}/>
                                <div className="d-flex outline">
                                    {
                                        acceptedFiles[0] ?
                                            update.previews.map( (item, idx) => (
                                                <div className="preview" key={`prew-${idx}`}>
                                                    <LazyImg src={item} alt={`prew-${idx}`} className="img-fluid"/>
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
                                    logo_img_url ?
                                        <LazyImg src={logo_img_url} alt="preview" className="img-fluid"/> :
                                        <span>Вы пока не загрузили ваш логотип</span>
                                }
                            </div>
                        </Col>
                    </Row>

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
                            text: "Здесь в должны указать всю информацию котораю должен знать клиент (правила доставки, оплаты и тд.)"
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

export default connect(mapStateToProps, { getUser, setShopUpdateRequest, setShopUpdateSuccess, shopUpdateClear, setShopUpdateError, setShopPreview })( withGetData(ShopProfile, mapMethodsToProps));
