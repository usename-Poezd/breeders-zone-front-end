import Error from "../_error";
import React from "react";
import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import DocsSidebar from "../../components/docs-sidebar";
import Head from "next/head";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleLeft, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const DocumentPage = ({statusCode, documents, document}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return (
        <Container fluid>
            <Head>
                <title>{document.title} | Breeders Zone</title>
            </Head>
            <Row className="justify-content-center">
                <div className="d-flex d-md-none justify-content-between align-items-center overflow-hidden sticky-top py-2 px-4 bg-white border-bottom">
                    <Link href={"/reducer"}>
                        <a>
                            <FontAwesomeIcon icon={faArrowLeft} size="2x" className="color-main"/>
                        </a>
                    </Link>
                    <h1 className="ml-2 text-nowrap overflow-hidden" style={{textOverflow: 'ellipsis'}}>{document.title}</h1>
                </div>
                <Col xs={12} md={9}>
                    <Container fluid>
                        <Row>
                            <Col xs={4} className="d-none d-md-block">
                                <DocsSidebar documents={documents}/>
                            </Col>
                            <Col xs={12} md={8}>
                                <div className="document">
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
};

export default DocumentPage;

export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const reducer = await dataService.getDocuments();
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
