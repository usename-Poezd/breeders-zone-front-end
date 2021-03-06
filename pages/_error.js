import {Container} from "react-bootstrap";
import React from "react";
import Head from "next/head";

function Error({ statusCode }) {
    return (
        <Container>
            <Head>
                <title>{statusCode && statusCode === 404 ? 'Упс... такой страницы не существует' : ''} Что-то пошло не так | Breeders Zone</title>
            </Head>
            <div className="feather-shadow p-4 mt-4">
                {
                    statusCode ?
                        (
                            <React.Fragment>
                                <h1 className="text-center">{statusCode}</h1>
                                <p className="text-center">
                                    {
                                        statusCode !== 404 ?
                                            'Ошибка на сервере, попробуйте перезагрузить страницу'
                                            : 'Упс... такой страницы не существует'
                                    }
                                </p>
                            </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                <h1 className="text-center">Ошибка у клиента</h1>
                                <p className="text-center">Попробуйте перезагрузить страницу</p>
                            </React.Fragment>
                        )
                }
            </div>
        </Container>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode }
};

export default Error
