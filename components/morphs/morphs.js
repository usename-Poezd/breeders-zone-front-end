import React, { Component } from 'react';
import {Col, Row, Spinner as BootstrapSpinner} from 'react-bootstrap';
import {connect} from "react-redux";

import RenderMorphs from '../render-morphs';
import { withGetData, withErrorBoundry } from '../hoc-helpers';
import {Pipes} from "../../services";
import Spinner from "../spinner";
import Link from "next/link";
import {withRouter} from "next/router";
import Head from "next/head";
import {toUrl} from "../../utils";

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

        if (prevProps.activeKind !== this.props.activeKind
            && toUrl(this.props.router.query.kind) === toUrl(this.props.activeKind?.title_eng)) {
            this.setState({
                request: false
            });
        }

        if (prevProps.activeKind !== this.props.activeKind
            && toUrl(this.props.router.query.kind) !== toUrl(this.props.activeKind?.title_eng)) {
            this.setState({
                request: true
            });
        }
    }

    render() {
        const { morphs: {genes, subcategories},  activeKind} = this.props;
        const { kind, group } = this.props.router.query;
        const { request } = this.state;

        if (request && genes.length === 0 && subcategories.length === 0) {
            return <Spinner/>;
        }

        if(genes.length === 0 && subcategories.length === 0 && !request && activeKind.title_eng) {
            return (
                <React.Fragment>
                    <Head>
                        <title>Похоже в категории {activeKind.title_rus} нет активных морф</title>
                    </Head>
                    <Row className="mt-5">
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
                    <Row className="mt-5">
                        <Col xs={12} className="text-center d-flex h-100">
                            <h2 className="m-auto">Похоже в категории {activeKind.title_rus} нет животных</h2>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }

        return (
            <div className="body-container d-flex flex-column justify-content-between position-relative">
                <div>
                    {
                       request ?
                           <div className="load">
                               <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                           </div>
                           : null
                    }
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
                                                               <div className="morph-indicator-count morph-other-normal ml-2">{item.products_count}</div>
                                                           </a>
                                                       </Link>
                                                   </div>
                                                   {
                                                       item.localities ?
                                                           (
                                                               <ul className="pl-4 localities">
                                                                   {
                                                                       item.localities.map( (locality) => {
                                                                           if (locality.products_count) {
                                                                               return (
                                                                                   <li className="localities-item">
                                                                                       <Link key={locality.title} href="/[group]/[kind]" as={`/${group}/${kind}?locality=${locality.id}`} >
                                                                                           <a className="d-flex justify-content-between">
                                                                                               <h3>{locality.title}</h3>
                                                                                               <div className="morph-indicator-count morph-other-normal ml-2">{locality.products_count}</div>
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
                </div>
                <Row className="justify-content-center mt--15">
                    <Col xs={12} lg={7}>
                        <div className="feather-shadow p--20">
                            <h3 className="text-center">Обозначения в таблице</h3>
                            <div>
                                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100 mb--5">
                                    <p
                                        className="w-100 text-center text-md-left mb--5"
                                        style={{
                                            lineHeight: 1.1
                                        }}
                                    >
                                        Доминантные и Ко-доминантные гены<br/>
                                        <span
                                            style={{
                                                fontSize: 12
                                            }}
                                        >(Dominant and Co-dominant genes)</span>
                                    </p>
                                    <div className="morphs-table morphs justify-content-center">
                                        <div className="morph-indicator"></div>
                                        <div className="morph-indicator morph-dominant-normal">Visual</div>
                                        <div className="morph-indicator morph-dominant-super">Super</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100 mb--5">
                                    <p
                                        className="w-100 text-center text-md-left mb--5"
                                        style={{
                                            lineHeight: 1.1
                                        }}
                                    >
                                        Рецессивные гены&nbsp;
                                        <span
                                            style={{
                                                fontSize: 12
                                            }}
                                        >(Recessive genes)</span>
                                    </p>
                                    <div className="morphs-table morphs justify-content-center">
                                        <div className="morph-indicator morph-recessive-possible-het">poss. Het.</div>
                                        <div className="morph-indicator morph-recessive-het">100% Het.</div>
                                        <div className="morph-indicator morph-recessive-visual">Visual</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100">
                                    <p className="w-100 text-center text-md-left mb--5" style={{
                                        lineHeight: 1.1
                                    }}>Другие визуальные признаки<br/><span style={{
                                        fontSize: 12
                                    }}>(селекционные, природные и генетические)</span></p>
                                    <div className="morphs-table morphs justify-content-center">
                                        <div className="morph-indicator morph-other-possible">possible</div>
                                        <div className="morph-indicator morph-other-normal">Visual</div>
                                        <div className="morph-indicator"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} lg={7}>
                        <Link
                            href={"/[group]/[kind]"}
                            as={`/${group}/${kind}`}
                        >
                            <a className="d-block feather-shadow text-center h3 btn-second-bn p--10 mt--10">
                                Показать всех животных в категории {activeKind.title_rus}
                            </a>
                        </Link>
                    </Col>
                </Row>
            </div>
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
