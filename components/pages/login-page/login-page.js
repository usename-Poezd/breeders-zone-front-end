import React from 'react';

import { Row, Col } from 'react-bootstrap';

import Login from '../../login';
import ContinueRegistration from '../../continue-reg';

const LoginPage = () => {
    return (
        <Row>
            <Col xs={12} lg={8}>

            </Col>
            <Col xs={12} lg={4}>
                <Login/>
                <ContinueRegistration/>
            </Col>
        </Row>
    );
};

export default LoginPage;
