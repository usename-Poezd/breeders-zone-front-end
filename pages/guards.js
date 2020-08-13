import React, {useEffect, useState} from "react";
import {Card, CardColumns, Col, Container, Form, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {DataService} from "../services";
import {Spinner as BootstrapSpinner} from "react-bootstrap";
import Head from "next/head";
import Linkify from "react-linkify";

const qs = require('qs');

const Guards = (props) => {

    const {allKinds, router, guards} = props;
    const [q, setQuery] = useState();
    const [request, setRequest] = useState(false);

    useEffect(() => {
        const handleRouteChange = () => {
            setRequest(true);
        };

        const handleRouteComplete = () => {
            setRequest(false);
        };

        router.events.on('routeChangeStart', handleRouteChange);
        router.events.on('routeChangeComplete', handleRouteComplete);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            router.events.off('routeChangeComplete', handleRouteComplete);
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const {router} = props;

        const newQuery = router.query;
        newQuery.q = q;

        router.push('/guards?' + qs.stringify(newQuery));
    };
    const setSearch = (e) => {
        setQuery(e.target.value);
    };

    return (
        <Container className="body-second-container">
            <Head>
                <title>Хранители | Breeders Zone</title>
            </Head>
            <Row className="mt-3">
                <Col xs={12}>
                    <h1 className="text-center">Хранители</h1>
                    <p className="text-center w-50 m-auto">Эти люди заботятся о вас, оценивая животное или сообщают о не корректной морфе</p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12}>
                    <Form onSubmit={onSubmit} className="dashboard-filter d-flex">
                        <div className="dashboard-search-container">
                            <Form.Control
                                className="dashboard-search feather-shadow"
                                placeholder="Поиск..."
                                onChange={setSearch}
                            />
                            <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={onSubmit}/>
                        </div>
                        <div className="dashboard-select select-wrap" >
                            <Form.Control
                                as="select"
                                onChange={(e) => {
                                    const newQuery = router.query;

                                    if (e.target.value === 'all') {
                                        delete newQuery.kind;
                                        router.push('/guards?' + qs.stringify(newQuery));
                                        return;
                                    }

                                    newQuery.kind = e.target.value;
                                    router.push('/guards?' + qs.stringify(newQuery));
                                }}
                                value={router.query.kind ? router.query.kind : 'all'}
                            >
                                <option value="all">Все категории</option>
                                {
                                    allKinds.map( (item) =><option key={item.id} value={item.title_eng}>{item.title_rus}</option> )
                                }
                            </Form.Control>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-4 position-relative">
                {
                    !request && guards.data.length === 0 ?
                        <Col xs={12} className="d-flex flex-column justify-content-center m-auto">
                            <img src="/images/icons/error-snake.svg" alt="Пока что нет активных категорий"/>
                            <h1 className="text-center">Хранителей еще нет</h1>
                        </Col>
                        : null
                }
                {
                    request && guards.data.length === 0 ?
                        <Col xs={12} className="d-flex">
                            <BootstrapSpinner className="m-auto" animation="border"/>
                        </Col>
                        : null
                }
                {
                    request && guards.data.length > 0 ?
                        <Col xs={12} className="load">
                            <BootstrapSpinner className="m-auto" animation="border"/>
                        </Col>
                        : null
                }
                <Col xs={12}>
                    <CardColumns className="guard">
                        {
                            guards.data.map( (item, idx) => (
                                <Card key={item.id} className="guard-item feather-shadow">
                                    <a className="profile">
                                        <div className="profile-img">
                                            {
                                                item.profile_img ?
                                                    <img
                                                        src={item.profile_img}
                                                        alt={item.name + " " + item.surname}
                                                        className="img-fluid"
                                                    />
                                                    : <img
                                                        src={'/images/icons/error-snake.svg'}
                                                        alt="error"
                                                        className="img-fluid"
                                                    />

                                            }
                                        </div>
                                        <div className="profile-info">
                                            <h3>{item.name} {item.surname}</h3>
                                        </div>

                                        <div className="profile-level">
                                            <img src="https://sun1-19.userapi.com/ltMSG09VhhydvjKqDIda5Ly3mjVF1mAj3NLnnQ/0SWVXKX1lOY.jpg" alt="" className="img-fluid"/>
                                        </div>
                                    </a>
                                    <hr/>
                                    <p style={{whiteSpace: 'pre-wrap'}}>
                                        <Linkify>
                                            {item.about}
                                        </Linkify>
                                    </p>
                                    <hr/>
                                    <h3>Категории:</h3>
                                    <div className="morphs selected-morphs">
                                        {
                                            item.guardians_kinds.map( (item, idx) => (
                                                <div
                                                    className="morph-indicator morph-other-normal d-inline-block"
                                                    key={'kinds-' + idx}
                                                >
                                                    {item.title_rus}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Card>
                            ))
                        }
                    </CardColumns>
                </Col>
            </Row>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const guards = await dataService.getGuards(ctx.query);

    return {
        props: {
            guards
        }
    }
};

const mapStateToProps = ({kinds: {all: allKinds}}) => ({
    allKinds
});

export default connect(mapStateToProps)(withRouter(Guards));
