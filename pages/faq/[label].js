import React from "react";
import {DataService} from "../../services";
import {Container, Row, Col} from "react-bootstrap";
import Error from "../_error";
import Head from "next/head";

export default ({faq, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return (
        <Container className="body-container">
            <Head>
                <title>{faq.title} | Breeders Zone</title>
            </Head>
            <Row className="justify-content-center">
                <Col xs={12} className="mb-3">
                    <h1>{faq.title}</h1>
                </Col>
                {
                    faq.description ?
                        <Col xs={12} className="feather-shadow faq-page">
                            <div dangerouslySetInnerHTML={ { __html: faq.description } }></div>
                        </Col>
                        : null
                }
            </Row>
        </Container>
    );
}

export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const faq = await dataService.getFaq(ctx.query.label);

        return {
            props: {
                statusCode: 200,
                faq
            }
        }
    } catch (e) {
        ctx.res.statusCode = e.response.status;
        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
};
