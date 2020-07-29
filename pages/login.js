import React from "react";
import {Col, Row, Container} from "react-bootstrap";
import Login from "../components/login";
import ContinueRegistration from "../components/continue-reg";

export default () => {
    return (
        <Container className="body-second-container">
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
