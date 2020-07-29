import React from "react";
import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import Link from "next/link";

export default ({faqs}) => {
    return (
        <Container className="body-container">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="d-flex flex-column mb-3">
                    <h1>FAQ</h1>
                    <p>Здесь вы найдете ответы на все вопросы.</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {
                    faqs.map((item) => (
                        <Link
                            key={item.label}
                            href="/faq/[label]"
                            as={`/faq/${item.label}`}
                        >
                            <a className="col-12 col-md-6 col-lg-4 d-flex">
                                <h2>{item.title}</h2>
                            </a>
                        </Link>
                    ))
                }
            </Row>
        </Container>
    )
}

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const faqs = await dataService.getFaqs();

    return {
        props: {
            faqs
        }
    }
};
