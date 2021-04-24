import Link from "next/link";
import {Col, Row, Container} from "react-bootstrap";
import {connect} from "react-redux";
import React, {useState} from "react";
import {DataService, Pipes} from "../services";
import {setActiveKind, setSeo} from "../actions";
import LazyImg from "../components/lazy-img";
import wrapper from "../store";

const Index = ({kinds, setActiveKind}) => {
    const pipes = new Pipes();
    const [showNotActive, setShowNotActive] = useState(false);

    return (
        <Container as="section" className="body-container">
            <Row className="justify-content-center" style={{marginTop: 10}}>
                <Col xs={12} md={8}>
                    <h1 className="h2 text-center p-3"><span className="text-corp">BREEDERS <span className="color-second">ZONE</span><sup>&copy;</sup></span> &mdash; это маркетплейс где вы можете быстро найти и продать животное</h1>
                </Col>
            </Row>
            <Row className="justify-content-center align-items-center" style={{marginTop: 10}}>
                {
                    kinds.active.length === 0 ?
                        <Col xs={12} className="d-flex flex-column justify-content-center m-auto">
                            <img src="/images/icons/error-snake.svg" alt="Пока что нет активных категорий"/>
                            <h1 className="text-center">Пока что нет активных категорий</h1>
                        </Col>
                        : null
                }
                {
                    kinds.active.map( (item) => (
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
                                            <LazyImg src={item.logo_square ? item.logo_square : '/images/icons/error-snake.svg'} alt={item.title_rus} className="img-fluid"/>
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

            <Row className={"justify-content-center align-items-center" + (!showNotActive && ' d-none')} style={{marginTop: 10}}>
                <Col xs={12} className="text-center mb-3"><h2>Неактивные категории</h2></Col>
                {
                    kinds.all.filter(item => !kinds.active.find(i => item.id === i.id)).map((item) => (
                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="mb-3" key={'kind-not-' + item.id}
                            onClick={() => setActiveKind(item)}
                        >
                            <a className="home-card disabled">
                                <div className="home-card-img">
                                    <div className="img-container">
                                        <LazyImg
                                            src={item.logo_square ? item.logo_square : '/images/icons/error-snake.svg'}
                                            alt={item.title_rus} className="img-fluid"/>
                                    </div>
                                </div>
                                <div className="home-card-info">
                                    <h3>{item.title_rus}</h3>
                                </div>
                            </a>
                        </Col>
                    ))
                }
            </Row>
            <Row>
                <Col xs={12} className="d-flex justify-content-center">
                    <button className="btn btn-main" onClick={() => setShowNotActive(!showNotActive)}>{!showNotActive ? 'Показать неактивные категории' : 'Скрыть'}</button>
                </Col>
            </Row>
        </Container>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async  (ctx) => {
    const dataService = await new DataService();

    const seo = await dataService.getDefaultSeo();

    ctx.store.dispatch(setSeo(seo));
});

const mapStateToProps = ({kinds}) => ({
    kinds
});

export default connect(mapStateToProps, {setActiveKind})(Index);
