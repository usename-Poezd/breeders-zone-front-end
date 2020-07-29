import Error from "../_error";
import React from "react";
import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import DocsSidebar from "../../components/docs-sidebar";
import Head from "next/head";

export default ({statusCode, documents, document}) => {
    console.log(document);
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return (
        <Container fluid>
            <Head>
                <title>{document.title}</title>
            </Head>
            <Row className="justify-content-center">
                <Col xs={12} md={9}>
                    <Container fluid>
                        <Row>
                            <Col xs={4}>
                                <DocsSidebar documents={documents} paddingTop={20}/>
                            </Col>
                            <Col xs={8}>
                                <div>
                                    <h1>{document.title}</h1>
                                    <div dangerouslySetInnerHTML={ { __html: document.description } }></div>
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
    try {
        const dataService = await new DataService();
        const documents = await dataService.getDocuments();
        const document = await dataService.getDocument(ctx.query.label);

        return {
            props: {
                statusCode: 200,
                documents,
                document
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
