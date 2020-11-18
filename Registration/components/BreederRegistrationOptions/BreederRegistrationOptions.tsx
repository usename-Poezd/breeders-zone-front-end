import React, {FC, useEffect} from "react";
import {useStore} from "react-redux";
import {FormInput, FormMaskedInput, FormSelect, FormTextArea} from "../../../components/Form";
import {Field, FormikProps} from "formik";
import {IRootState} from "../../../redux/store";
import {useDataService} from "../../../hooks";
import {Col, Row} from "react-bootstrap";
import {IRegistrationData} from "../../../types";

const BreederRegistrationOptions: FC<FormikProps<IRegistrationData>> = (props) => {
    const {countries}: IRootState = useStore().getState();
    const dataService = useDataService();
    useEffect(() => {
        dataService.getCountryByIp()
            .then((countryCode) => {
                const country = countries.all.find((item) => item.iso_3166_2 === countryCode);
                if (country) {
                    props.setFieldValue('country', country.name);
                }
            })
    }, []);
    const {country} = props.values;
    const countryCallCode = countries.all.find((item) => item.name === country)?.calling_code;
    const countryCallCodeMask = countryCallCode?.replace('9', '\\9');

    return (
        <React.Fragment>
            <Field id="company_name" name="company_name" description="Имеедтся ввиду название вашего питомника, магазина и тп." required label="Назание вашей компании" placeholder="Моя компания" component={FormInput}/>
            <Field
                id="country"
                name="country"
                className="w-100"
                required
                label="Укажите страну"
                options={countries.all.map((item) => ({label: item.name, value: item.name}))}
                component={FormSelect}
            />
            <Field id="phone" name="phone" type="tel" required label="Телефон" description="Ваш телефон будет виден только вам" placeholder={`+${countryCallCode} 999 999 99 99`} mask={`+${countryCallCodeMask} 999 999 99 99`} component={FormMaskedInput}/>
            <Field id="location" name="location" required label="Локация" placeholder="Москва" component={FormInput}/>
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

            <Field id="about" name="about" label="О себе:" placeholder="Что-то о себе, чем вы занимаетесь?" component={FormTextArea}/>
            <Field id="policity" name="policity" required label="Политика:" description="Здесь вы должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)" placeholder="Здесь вы должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)" component={FormTextArea}/>
        </React.Fragment>
    )
};

export {
    BreederRegistrationOptions
}
