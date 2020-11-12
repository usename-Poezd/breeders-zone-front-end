import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import DocsSidebar from "../../components/docs-sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";

export default ({documents}) => {
    return (
        <Container fluid>
            <Head>
                <title>Юредичиские документы | Breeders Zone</title>
            </Head>
            <Row className="justify-content-center">
                <Col xs={12} md={9}>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={4}>
                                <h1 className="d-block d-md-none pb--15 pt--20">Юредические документы</h1>
                                <DocsSidebar documents={documents}/>
                            </Col>
                            <Col xs={8} className="d-none d-md-flex">
                                <div className="text-center m-auto w-50">
                                    <FontAwesomeIcon icon={faBook} size="4x"/>
                                    <h2 className="mt-2">Выберите документ для прочтения.</h2>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const reducer = await dataService.getDocuments();

    return {
        props: {
            statusCode: 200,
            documents
        }
    }
};
