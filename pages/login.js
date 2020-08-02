import React from "react";
import {Col, Row, Container} from "react-bootstrap";
import Login from "../components/login";
import ContinueRegistration from "../components/continue-reg";
import Head from "next/head";
import {serverRedirect} from "../utils";
import nookies from "nookies";

export default () => {
    return (
        <Container className="body-second-container">
            <Head>
                <title>Вход | Breeders Zone</title>
                <meta name="description" content="Breeders Zone это маркетплейс где вы можете бысто найти и продать животное, больше никаних групп и форумов, все в одном месте"/>
            </Head>
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

export const getServerSideProps = (ctx) => {
    if (nookies.get(ctx).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }

    return {
        props: {}
    }
};
