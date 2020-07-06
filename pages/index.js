import Link from "next/link";
import {Col, Row, Container} from "react-bootstrap";
import Spinner from "../components/spinner";
import {connect} from "react-redux";
import React from "react";
import {Pipes} from "../services";
import {setActiveKind, setKinds} from "../actions";
import LazyImg from "../components/lazy-img";
import wrapper from "../store";
import Axios from "axios";
const Index = ({activeKinds, setActiveKind}) => {
    const pipes = new Pipes();

    return (
        <Container>
            <Row className="justify-content-center" style={{marginTop: 10}}>
                <Col xs={12} md={8}>
                    <h2 className="text-center p-3">Breeders Zone это маркетплейс где вы можете бысто найти и продать животное</h2>
                </Col>
            </Row>
            <Row className="justify-content-center" style={{marginTop: 10}}>
                {
                    activeKinds.length === 0 ?
                        <Col xs={12} className="d-flex flex-column justify-content-center m-auto" style={{height: '70vh'}}>
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
                                            <LazyImg src={item.logo_square ? item.logo_square : '/images/error-snake.svg'} alt={item.title_rus} className="img-fluid"/>
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

// export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
//     const state = await ctx.store.getState();
//     if (state.kinds.all.length === 0 && state.kinds.active.length === 0) {
//         const kinds = await Axios.get(
//             'http://nginx-web/api/kinds',
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: 'application/json'
//                 }
//             }
//         )
//             .then((resp) => resp.data);
//
//         console.log(kinds);
//         const a = await setKinds(kinds);
//         ctx.store.dispatch(a);
//     }
// });

export default connect(mapStateToProps, {setActiveKind})(Index);