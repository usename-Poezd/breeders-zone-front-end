import Link from "next/link";
import {Col, Row, Container} from "react-bootstrap";
import Spinner from "../components/spinner";
import {connect} from "react-redux";
import React from "react";
import {Pipes} from "../services";
import {setActiveKind} from "../actions";
const Index = ({activeKinds, setActiveKind}) => {
    const pipes = new Pipes();

    return (
        <Container>
            <Row className="justify-content-center">
                {
                    activeKinds.length === 0 ?
                        <Col xs={12} className="d-flex flex-column justify-content-center m-auto" style={{height: '75vh'}}>
                            <img src="/images/icons/error-snake.svg" alt="Пока что нет активных категорий"/>
                            <h1 className="text-center">Пока что нет активных категорий</h1>
                        </Col>
                        : null
                }
                {
                    activeKinds.map( (item) => (
                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="mb-3" key={'kind-' + item.id}
                            onClick={() => setActiveKind(item)}
                        >
                            <Link href="/[group]/[kind]/morphs" as={`${item.group}/${pipes.toUrl(item.title_eng)}/morphs`}>
                                <a className="home-card">
                                    <div className="home-card-img">
                                        <div className="img-container">
                                            <img src={item.logo} alt="snake" className="img-fluid"/>
                                        </div>
                                    </div>
                                    <div className="home-card-info">
                                        <h3>{item.title_rus}</h3>
                                    </div>
                                </a>
                            </Link>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

const mapStateToProps = ({kinds: {active: activeKinds}}) => ({
    activeKinds
});

export default connect(mapStateToProps, {setActiveKind})(Index);