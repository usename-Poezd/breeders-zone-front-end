import React from "react";
import {Container} from "react-bootstrap";
import Head from "next/head";

export default () => {
    return (
        <Container>
            <Head>
                <title>Упс... такой страницы не существует | Breeders Zone</title>
            </Head>
            <div className="feather-shadow p-4 mt-4">
                <h1 className="text-center">404</h1>
                <p className="text-center">Упс... такой страницы не существует</p>
            </div>
        </Container>
    )
}
