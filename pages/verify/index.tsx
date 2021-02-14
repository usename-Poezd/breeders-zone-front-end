import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import Head from "next/head";
import * as Cookie from "es-cookie";
import {NextPageContext} from "next";

export default () => {
    return (
        <Container>
            <Head>
                <title>Активируйте свой аккаунт | Breeders Zone</title>
            </Head>
            <Row>
                <Col xs={12}>
                    <div className="d-flex flex-column align-items-center feather-shadow p--15 mt--20">
                        <FontAwesomeIcon icon={faCheckCircle} size="8x" className="text-success mb-2"/>
                        <h1 className="text-center">Активируйте свой аккаунт.</h1>
                        <p className="text-center">Без активации аккаунта вы не сможете войти в свой профиль,<br/> на вашу почту было высланно письмо, с дальнейшими иструкциями по активации.</p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
};

export const getServerSideProps = (ctx: NextPageContext) => {
    if (Cookie.parse(String(ctx.req?.headers.cookie)).token && ctx.res) {
        ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 301;
        ctx.res.end();
    }

    return {
        props: {}
    }
};
