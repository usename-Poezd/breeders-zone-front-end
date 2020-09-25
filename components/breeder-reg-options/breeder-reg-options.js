import React from "react";
import {Form, Col, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {connect} from "react-redux";
import InputMask from "react-input-mask";
import {Controller} from "react-hook-form";

const BreederRegOptions = ({register, errors, control, countries, watch}) => {
    const {country} = watch();
    const countryCallCode = countries.all.find((item) => item.name === country)?.calling_code;
    const countryCallCodeMask = countryCallCode?.replace('9', '\\9');
    return (
        <React.Fragment>
            <GroupFormControl
                label="Назание вашей компании"
                nec={true}
                errors = {errors}
                controls={{
                    type:"text",
                    name:"company_name",
                    placeholder: "Моя компания",
                    ref:
                        register({
                            required: true
                        }),
                }}
            />
            <Form.Group className="d-flex flex-column locality">
                <Form.Label htmlFor="country">Укажите страну:</Form.Label>
                <div className="select-wrap w-100">
                    <Form.Control
                        id="country"
                        as="select"
                        name="country"
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
                    <p className="form-err text-danger">Пожалуйста укажите страну</p>
                }
            </Form.Group>
            <Form.Group>
                <Form.Label>Телефон:</Form.Label>
                <Controller
                    as={InputMask}
                    mask={`+${countryCallCodeMask} 999 999 99 99`}
                    maskPlaceholder={null}
                    placeholder={`+${countryCallCode} 999 999 99 99`}
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
                nec={true}
                errors = {errors}
                controls={{
                    type:"text",
                    placeholder: "Тула",
                    name:"location",
                    ref: register({ required: true })
                }}
            />
            <GroupFormControl
                label="Сайт"
                errors = {errors}
                controls={{
                    type:"text",
                    name:"website",
                    ref: register
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
                            ref: register
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
                            ref: register
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
                            ref: register
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
                            ref: register
                        }}
                    />
                </Col>
            </Row>
            <GroupFormControl
                label="О себе"
                textArea = {true}
                errors = {errors}
                controls={{
                    type: "text",
                    name: "description",
                    ref: register
                }}
            />
            <GroupFormControl
                label="Политика магазина"
                nec={true}
                info={{
                    isInfo: true,
                    text: "Здесь вы должны указать всю информацию которую должен знать клиент (правила доставки, оплаты и тд.)"
                }}
                textArea = {true}
                errors = {errors}
                controls={{
                    type: "text",
                    name: "policity",
                    ref: register({ required: true })
                }}
            />
        </React.Fragment>
    )
};

const mapStateToProps = ({countries}) => ({
    countries
});

export default connect(mapStateToProps)(BreederRegOptions);
