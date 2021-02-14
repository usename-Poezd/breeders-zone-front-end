import React, {FC, useState} from "react";
import {Col, Form, Modal, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {connect} from "react-redux";
import Spinner from "../../../components/spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faPen, faTruck} from "@fortawesome/free-solid-svg-icons";
import {
    setShopUpdateError,
    setShopUpdateSuccess,
    shopUpdateClear
} from "../../../redux/Shop";
import {HandelSuccess, HandelError} from "../../../components/handels";
import {useRouter} from "next/router";
import LazyImg from "../../../components/lazy-img";
import ImageCrop, {Crop} from "../../../components/ImageCrop";
import {useDataService} from "../../../hooks";
import {Formik, Form as FormikForm, Field, FormikProps, FormikHelpers} from "formik";
import {FormInput} from "../../../components/Form/components/FormInput";
import {FormSelect} from "../../../components/Form/components/FormSelect";
import {FormMaskedInput} from "../../../components/Form/components/FormMaskedInput";
import {FormTextArea} from "../../../components/Form/components/FormTextArea";
import {IRootState} from "../../../redux/store";
import {IInitialValues, IShopProfileStateProps, ShopProfilePropsType} from "./types";
import {IUser} from "../../../types";
import {FormCheckbox} from "../../../components/Form/components/FormCheckbox";
import * as Yup from "yup";
import {setUser} from "../../../redux/Auth";

const ShopProfileComponent: FC<ShopProfilePropsType> = (props) => {

    const {
        user,
        shopUpdateClear,
        setShopUpdateSuccess,
        setShopUpdateError,
        setUser,
        shop,
        isLogin,
        countries,
        loginRequest
    } = props;

    const {updateShop} = useDataService();

    const router = useRouter();

    if(isLogin && loginRequest){
        return (
            <Row className="justify-content-center">
                <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                    <Spinner/>
                </Col>
            </Row>
        )
    }

    if (((user &&!user.is_breeder) || !isLogin) && typeof window !== 'undefined'){
        router.push('/');
    }

    const initialValues: IInitialValues = {
        company_name: user && user.company_name || '',
        country: user && user.country.name || '',
        countrywide_delivery: user && user.countrywide_delivery || false,
        description: user && user.description || "",
        facebook: user && user.facebook || "",
        instagram: user && user.instagram || "",
        location: user && user.location || "",
        local_delivery: user && user.local_delivery || false,
        logo_img_url: user && user.logo_img_url || "",
        owner: user && user.owner || "",
        phone: user && user.phone || "",
        policity: user && user.policity || "",
        regional_delivery: user && user.regional_delivery || false,
        vk: user && user.vk || "",
        website: user && user.website || "",
        youtube: user && user.youtube || ""

    };

    const submitUpdate = (formData: IInitialValues, actions: FormikHelpers<IInitialValues>) => {
        const { company_name } = (user as IUser);

        updateShop(company_name, { ...formData})
            .then( ({data, message}) => {
                setShopUpdateSuccess(message);
                setUser(data);
                actions.setValues({
                    company_name: data.company_name,
                    country: data.country.name,
                    countrywide_delivery: data.countrywide_delivery,
                    description: data.description || "",
                    facebook: data.facebook || "",
                    instagram: data.instagram || "",
                    local_delivery: data.local_delivery,
                    location: data.location,
                    logo_img_url: data.logo_img_url,
                    owner: data.owner,
                    phone: data.phone && data.phone || formData.phone,
                    policity: data.policity,
                    regional_delivery: data.regional_delivery,
                    vk: data.vk || "",
                    website: data.website || "",
                    youtube: data.youtube || "",
                });
                actions.setSubmitting(false);
                setTimeout(()=> shopUpdateClear(), 5000);
            })
            .catch( (error) => {
                setShopUpdateError({errors: error.response.data.errors, status: error.status});
                setTimeout(()=> shopUpdateClear(), 5000);
            });
    };

    const updateImage = (crop: Crop) => {
        setImageUpdate(true);
        updateShop((user as IUser).company_name, {logo: crop}, true)
            .then(({data, message}) => {
                setUser({...data});
                setShopUpdateSuccess(message);
                setImageUpdate(false);
                setTimeout(() => shopUpdateClear(), 5000);
            })
            .catch((error) => {
                setShopUpdateError({errors: error.response.data.errors, status: error.status});
                setImageUpdate(false);
                setTimeout(() => shopUpdateClear(), 5000);
            });
        setChangeLogo(false);
    };

    const { update } = shop;

    const [changeLogo, setChangeLogo] = useState(false);
    const [imageUpdate, setImageUpdate] = useState(false);

    return (
        <Row className="flex-column flex-column-reverse flex-md-row justify-content-center">
            <Modal show={changeLogo} onHide={() => setChangeLogo(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Загрузка новой фотографии</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImageCrop
                        aspect={1}
                        onComplete={updateImage}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <p className="w-100 text-center">Если у Вас возникают проблемы с загрузкой, попробуйте выбрать фотографию меньшего размера.</p>
                </Modal.Footer>
            </Modal>
            <Col xs={12} md={9}>
                <Formik
                    validationSchema={Yup.object({
                        company_name: Yup.string().required('Название компании не указанно'),
                        country: Yup.string().required('Старана не указанна'),
                        phone: Yup.string().required('Телефон не указан'),
                        location: Yup.string().required('Локация не указанна'),
                        policity: Yup.string().required('Политика магазина не указанна'),
                    })}
                    initialValues={initialValues}
                    onSubmit={submitUpdate}
                >
                    {
                        ({values, isSubmitting}: FormikProps<IInitialValues>) => {
                            if (isSubmitting) {
                                return (
                                    <div className="form-container d-flex justify-content-center w-100">
                                        <div className="mt-3 py-5">
                                            <Spinner/>
                                        </div>
                                    </div>
                                )
                            }

                            const {
                                local_delivery,
                                regional_delivery,
                                countrywide_delivery,
                                country,
                            } = values;

                            const countryCallCode = !countries.all.find((item) => item.name === country)?.calling_code ?
                                countries.all.find((item) => user && item.name === user.country.name)?.calling_code
                                : countries.all.find((item) => item.name === country)?.calling_code;
                            const countryCallCodeMask = countryCallCode?.replace('9', '\\9');

                            return (
                                <FormikForm className="form-container">
                                    <HandelSuccess success={update.success}/>
                                    <HandelError error={update.error}/>
                                    <Field
                                        id="company_name"
                                        name="company_name"
                                        description="Имеедтся ввиду название вашего питомника, магазина и тп."
                                        required
                                        label="Назание вашей компании"
                                        placeholder="Моя компания"
                                        component={FormInput}
                                    />
                                    <Field
                                        id="owner"
                                        name="owner"
                                        required
                                        label="Владелец"
                                        component={FormInput}
                                    />
                                    <Field
                                        id="country"
                                        name="country"
                                        className="w-100"
                                        required
                                        label="Укажите страну"
                                        options={countries.all.map((item) => ({label: item.name, value: item.name}))}
                                        component={FormSelect}
                                    />
                                    <Field
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        label="Телефон"
                                        description="Ваш телефон будет виден только вам"
                                        placeholder={`+${countryCallCode} 999 999 99 99`}
                                        mask={`+${countryCallCodeMask} 999 999 99 99`}
                                        component={FormMaskedInput}
                                    />
                                    <Field id="location" name="location" required label="Локация" placeholder="Москва" component={FormInput}/>
                                    <Form.Group>
                                        <Form.Label>Доставка:</Form.Label>
                                        <Field
                                            type="checkbox"
                                            name="local_delivery"
                                            id="local_delivery"
                                            label={
                                                (
                                                    <div className="d-flex">
                                                        <FontAwesomeIcon icon={faCar} size="lg" className={"mr-1 " + ( local_delivery ? '' : 'disabled')}/>
                                                        <p>Локальная</p>
                                                    </div>
                                                )
                                            }
                                            group={false}
                                            component={FormCheckbox}
                                        />
                                        <Field
                                            type="checkbox"
                                            name="regional_delivery"
                                            id="regional_delivery"
                                            label={
                                                (
                                                    <div className="d-flex">
                                                        <FontAwesomeIcon icon={faTruck} size="lg" className={"mr-1 " + ( regional_delivery ? '' : 'disabled')}/>
                                                        <p>Региональная</p>
                                                    </div>
                                                )
                                            }
                                            group={false}
                                            component={FormCheckbox}
                                        />
                                        <Field
                                            type="checkbox"
                                            name="countrywide_delivery"
                                            id="countrywide_delivery"
                                            label={
                                                (
                                                    <div className="d-flex">
                                                        <FontAwesomeIcon icon={faHelicopter} size="lg" className={"mr-1 " + ( countrywide_delivery ? '' : 'disabled')}/>
                                                        <p>Международная</p>
                                                    </div>
                                                )
                                            }
                                            group={false}
                                            component={FormCheckbox}
                                        />
                                    </Form.Group>
                                    <Field
                                        id="description"
                                        name="description"
                                        label="Описание магазина"
                                        placeholder="Что-то о себе, чем вы занимаетесь?"
                                        component={FormTextArea}
                                    />
                                    <Field
                                        id="policity"
                                        name="policity"
                                        required
                                        label="Политика магазина"
                                        description="Здесь вы должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)"
                                        placeholder="Здесь вы должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)"
                                        component={FormTextArea}
                                    />

                                    <Field id="website" name="website" label="Сайт" placeholder="mysite.com" component={FormInput}/>
                                    <Row>
                                        <Col xs={12} md={3}>
                                            <Field id="vk" name="vk" label="Вконтакте" placeholder="Вконтакте" component={FormInput}/>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Field id="instagram" name="instagram" label="Instagram" placeholder="Instagram" component={FormInput}/>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Field id="facebook" name="facebook" label="Facebook" placeholder="Facebook" component={FormInput}/>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Field id="youtube" name="youtube" label="Youtube канал" placeholder="Youtube канал" component={FormInput}/>
                                        </Col>
                                    </Row>
                                    <button type="submit" className="btn btn-main">Сохранить</button>
                                </FormikForm>
                            );
                        }
                    }
                </Formik>
            </Col>
            <Col xs={12} md={3}>
                <div className="feather-shadow form-container">
                    <Row>
                        <Col xs={12}>
                            <h3 className="mb--5">Ваш логотип:</h3>
                            {
                                imageUpdate ?
                                    <div className="d-flex py-4">
                                       <BootstrapSpinner animation="border" className="m-auto"/>
                                    </div>
                                    : (
                                        <div className="shop-logo-preview">
                                            <span className="edit" onClick={() => setChangeLogo(true)}>
                                                <FontAwesomeIcon icon={faPen}/>
                                            </span>
                                            {
                                                user && user.logo_img_url ?
                                                    <LazyImg src={user.logo_img_url} alt="preview" className="img-fluid"/> :
                                                    <span>Вы пока не загрузили ваш логотип</span>
                                            }
                                        </div>
                                    )
                            }
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    )
};

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, countries, shop}: IRootState): IShopProfileStateProps => ({
    user,
    shop,
    isLogin,
    countries,
    loginRequest
});

const ShopProfile = connect(mapStateToProps, { setShopUpdateSuccess, shopUpdateClear, setShopUpdateError, setUser })(ShopProfileComponent);

export {
    ShopProfile
}
