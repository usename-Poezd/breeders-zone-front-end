import React, {useCallback} from "react";
import {Col, Form, Row} from "react-bootstrap";
import GroupFormConrol from "../group-form-control";
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
import {isLogin} from "../../utils";

const ShopProfile = ({user, getUser, updateShop, setShopUpdateRequest, shopUpdateClear, setShopUpdateSuccess, setShopUpdateError, shop, setShopPreview}) => {

    const router = useRouter();

    if(!user.name || shop.update.request){
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    if (!user.is_breeder && isLogin() && typeof window !== 'undefined'){
        router.push('/');
    }

    const { register, handleSubmit, watch, setValue, errors } = useForm({
        defaultValues: {
            company_name: user.company_name,
            owner: user.owner,
            local_delivery: user.local_delivery,
            regional_delivery: user.regional_delivery,
            countrywide_delivery: user.countrywide_delivery,
            phone: user.phone,
            description: user.description,
            policity: user.policity,
            vk: user.vk,
            facebook: user.facebook,
            instagram: user.instagram,
            youtube: user.youtube,
            website: user.website
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
        const { id } = user;

        setShopUpdateRequest();
        updateShop({id, ...data, logo: acceptedFiles[0]})
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
        policity,
        vk,
        facebook,
        instagram,
        youtube,
        website
    } = watch();

    const { update } = shop;


    return (
        <Row className="justify-content-center">
            <Col xs={12} md={9}>
                <Form className="form-container" onSubmit={handleSubmit(submitUpdate)} encType="multipart/form-data">
                    <HandelSuccess success={update.success}/>
                    <HandelError error={update.error}/>

                    <GroupFormConrol
                        label="Название компании"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "company_name",
                            onChange: handleChange,
                            value: company_name,
                            min: 1,
                            ref: register({
                                minLenght: 1
                            })
                        }}
                    />
                    <GroupFormConrol
                        label="Владелец"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "owner",
                            onChange: handleChange,
                            value: owner,
                            ref: register
                        }}
                    />

                    <GroupFormConrol
                        label="Телефон"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "phone",
                            onChange: handleChange,
                            value: phone,
                            ref: register({
                                pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
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
                                                <div className="preview">
                                                    <img src={item} alt={`prew-${idx}`} key={`prew-${idx}`} className="img-fluid"/>
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
                                        <img src={logo_img_url} alt="preview" className="img-fluid"/> :
                                        <span>Вы пока не загрузили ваш логотип</span>
                                }
                            </div>
                        </Col>
                    </Row>

                    <GroupFormConrol
                        label="Описание магазина"
                        textArea = {true}
                        errors = {errors}
                        controls={{
                            type: "text",
                            name: "description",
                            value: description,
                            onChange: handleChange,
                            ref: register
                        }}
                    />

                    <GroupFormConrol
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
                            value: policity,
                            onChange: handleChange,
                            min: 1,
                            ref: register({
                                minLenght: 1
                            })
                        }}
                    />

                    <GroupFormConrol
                        label="Сайт"
                        errors = {errors}
                        controls={{
                            type:"text",
                            name:"website",
                            value: website,
                            onChange: handleChange,
                            ref: register,
                            patern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                        }}
                    />
                    <Row>
                        <Col xs={12} md={3}>
                            <GroupFormConrol
                                label="Вконтакте"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "vk",
                                    value: vk,
                                    onChange: handleChange,
                                    ref: register,
                                    patern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                }}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <GroupFormConrol
                                label="Instagram"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "instagram",
                                    value: instagram,
                                    onChange: handleChange,
                                    ref: register,
                                    patern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                }}
                            />
                        </Col>

                        <Col xs={12} md={3}>
                            <GroupFormConrol
                                label="Facebook"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "facebook",
                                    value: facebook,
                                    onChange: handleChange,
                                    ref: register,
                                    patern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                }}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <GroupFormConrol
                                label="Youtube канал"
                                errors = {errors}
                                controls={{
                                    type: "text",
                                    name: "youtube",
                                    value: youtube,
                                    onChange: handleChange,
                                    ref: register,
                                    patern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
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

const mapStateToProps = ({profile: {user},shop}) => ({
    user,
    shop
});

const mapMethodsToProps = (getData) => ({
    updateShop: getData.updateShop
});

export default connect(mapStateToProps, { getUser, setShopUpdateRequest, setShopUpdateSuccess, shopUpdateClear, setShopUpdateError, setShopPreview })( withGetData(ShopProfile, mapMethodsToProps));
