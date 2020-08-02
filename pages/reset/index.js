import React from "react";
import {Container} from "react-bootstrap";
import ResetPassword from "../../components/reset-password";
import Head from "next/head";

export default () => {
    return (
        <Container className="body-second-container">
            <ResetPassword/>
        </Container>
    )
}
