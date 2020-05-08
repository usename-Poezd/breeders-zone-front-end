import React from "react";
import {Col, Row, Container} from "react-bootstrap";
import Login from "../components/login";
import ContinueRegistration from "../components/continue-reg";
import Header from "../components/header/header";

export default () => {
    return (
        <Container>
            <Row>
                <Col xs={12} lg={8}>

                </Col>
                <Col xs={12} lg={4}>
                    <Login/>
                    <ContinueRegistration/>
                </Col>
            </Row>
        </Container>
    )
};