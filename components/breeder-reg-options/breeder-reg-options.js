import React from "react";
import {Col, Row} from "react-bootstrap";
import GroupFormConrol from "../group-form-control";

const BreederRegOptions = ({register, errors}) => {


    return (
        <React.Fragment>
            <GroupFormConrol
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
            <GroupFormConrol
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
            <GroupFormConrol
                label="Локация"
                nec={true}
                errors = {errors}
                controls={{
                    type:"text",
                    placeholder: "Тула, Россия",
                    name:"location",
                    ref: register({ required: true })
                }}
            />
            <GroupFormConrol
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
                    <GroupFormConrol
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
                    <GroupFormConrol
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
                    <GroupFormConrol
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
                    <GroupFormConrol
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
            <GroupFormConrol
                label="О себе"
                textArea = {true}
                errors = {errors}
                controls={{
                    type: "text",
                    name: "description",
                    ref: register
                }}
            />
            <GroupFormConrol
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

export default BreederRegOptions;
