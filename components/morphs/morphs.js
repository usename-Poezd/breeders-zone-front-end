import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';
import {connect} from "react-redux";

import RenderMorphs from '../render-morphs';
import { withGetData, withErrorBoundry } from '../hoc-helpers';
import {Pipes} from "../../services";
import Spinner from "../spinner";
import Link from "next/link";
import {withRouter} from "next/router";
import Head from "next/head";

class Morphs extends Component {
    state = {
        activeKind: null,
        request: true,
    };

    pipes = new Pipes();

    componentDidMount() {
        this.setState({
            request: false
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.activeKinds !== this.props.activeKinds && prevProps.activeKinds.length !== 0) {
            this.setState({
                request: false
            });
        }
    }

    render() {
        const { morphs: {genes, subcategories},  activeKind} = this.props;
        const { kind, group } = this.props.router.query;
        const { request } = this.state;

        if (request) {
            return <Spinner/>;
        }

        if(genes.length === 0 && subcategories.length === 0 && !request && activeKind.title_eng) {
            return (
                <React.Fragment>
                    <Head>
                        <title>Похоже в категории {activeKind.title_rus} нет активных морф</title>
                    </Head>
                    <Row>
                        <Col xs={12} className="text-center d-flex h-100">
                            <h2 className="m-auto">Похоже в категории {activeKind.title_rus} нет активных морф</h2>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }

        if(genes.length === 0 && subcategories.length === 0 && !request && !activeKind.title_eng) {
            return (
                <React.Fragment>
                    <Head>
                        <title>Похоже в категории {activeKind.title_rus} нет животных</title>
                    </Head>
                    <Row>
                        <Col xs={12} className="text-center d-flex h-100">
                            <h2 className="m-auto">Похоже в категории {activeKind.title_rus} нет животных</h2>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <Head>
                    <title>Морфы {activeKind.title_rus}  ({activeKind.title_eng})</title>
                </Head>
                {
                    genes.length > 0 ?
                        (
                            <React.Fragment>
                                <h2 className="mb-2">Морфы:</h2>
                                <Row className="mb-3">
                                    {
                                        genes.map( (item) => <RenderMorphs key={item.title} title={item.title} traits={item.traits}/>)
                                    }
                                </Row>
                            </React.Fragment>
                        )
                        : null
                }
                {
                    subcategories.length > 0 ?
                        (
                            <React.Fragment>
                                <h2 className="mb-2">Подкатегории и локалитеты:</h2>
                                <Row className="flex-column subcategories align-items-center">
                                    {
                                        subcategories.map( (item) => (
                                            <Col key={item.title} xs={12} md={4} className="subcategories-item">
                                                <div className="subcategories-title">
                                                    <Link href="/[group]/[kind]/subcategories/[subcategoryTitle]" as={`/${group}/${kind}/subcategories/${this.pipes.toUrl(item.title)}`}>
                                                        <a className="d-flex justify-content-between w-100">
                                                            <h3>{item.title}</h3>
                                                            <div className="morph-indicator-count morph-other-normal ml-2">{item.count}</div>
                                                        </a>
                                                    </Link>
                                                </div>
                                                {
                                                    item.localities ?
                                                        (
                                                            <ul className="pl-4 localities">
                                                                {
                                                                    item.localities.map( (locality) => {
                                                                        if (locality.count) {
                                                                            return (
                                                                                <li className="localities-item">
                                                                                    <Link key={locality.title} href="/[group]/[kind]" as={`/${group}/${kind}?locality=${locality.id}`} >
                                                                                        <a className="d-flex justify-content-between">
                                                                                            <h3>{locality.title}</h3>
                                                                                            <div className="morph-indicator-count morph-other-normal ml-2">{locality.count}</div>
                                                                                        </a>
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </ul>
                                                        )
                                                        : null
                                                }
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </React.Fragment>
                        ) : null
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({kinds: {active: activeKinds, activeKind}}) => ({
    activeKinds,
    activeKind
});

const mapMethodsToProps = ({getActiveGenes}) => ({
    getActiveGenes
});
export default connect(mapStateToProps)(withRouter(withErrorBoundry(withGetData(Morphs, mapMethodsToProps))));
