import React, {useEffect} from "react";
import {Col, Row, Container} from "react-bootstrap";
import {Login} from "../Login";
import Head from "next/head";
import {useAuth} from "../hooks";
import {useRouter} from "next/router";

const LoginPage = () => {
    const {isLogin} = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (isLogin) {
            router.push('/');
        }
    }, [isLogin]);

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
                </Col>
            </Row>
        </Container>
    )
};

export default LoginPage;
