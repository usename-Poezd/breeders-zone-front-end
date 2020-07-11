import React from "react";
import {Form, Col, Row} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {connect} from "react-redux";
import {setSearchLocality} from "../../actions";

const BreederRegOptions = ({register, errors, countries}) => {
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
            <GroupFormControl
                label="Телефон"
                nec={true}
                errors = {errors}
                controls={{
                    type:"text",
                    name:"phone",
                    placeholder: "+7 (980) 728-58-18",
                    ref:
                        register({
                            required: true,
                            pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
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
                    <p className="form-err text-danger">Пожалуйста укажите страну`</p>
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
                    text: "Здесь в должны указать всю информацию котораю должен знать клиент (правила доставки, оплаты и тд.)"
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
