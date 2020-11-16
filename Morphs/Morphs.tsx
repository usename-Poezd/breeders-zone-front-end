import React, {FC, useEffect, useState} from 'react';
import {Col, Row, Spinner as BootstrapSpinner} from 'react-bootstrap';
import {connect} from "react-redux";
import Spinner from "../components/spinner";
import Link from "next/link";
import {useRouter} from "next/router";
import Head from "next/head";
import {toUrl} from "../utils";
import {MorphsItem} from "./components/MorphsItem";
import {IRootState} from "../redux/store";
import {IMorphsStateProps, MorphsPropsType} from "./types";

const MorphsComponent: FC<MorphsPropsType> = (props) => {
    const router = useRouter();
    const { morphs: {genes = [], subcategories = []},  activeKind, activeKinds} = props;
    const { kind, group } = router.query;
    const [request, setRequest] = useState(false);

    useEffect(() => {
        if (activeKinds.length !== 0) {
            setRequest(false);
        }
    }, [activeKinds]);

    useEffect(() => {
        if (toUrl(String(router.query.kind)) === toUrl(activeKind?.title_eng)) {
            setRequest(false);
        }

        if (toUrl(String(router.query.kind)) !== toUrl(activeKind?.title_eng)) {
            setRequest(true);
        }
    }, [activeKind]);

    if (request && genes.length === 0 && subcategories.length === 0) {
        return <Spinner/>;
    }

    if(genes.length === 0 && subcategories.length === 0 && !request && !activeKinds.find((item) => item.id === activeKind.id)) {
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
                    genes.length === 0 && subcategories.length === 0 &&
                    <Row className="mt-5">
                        <Col xs={12} className="text-center d-flex h-100">
                            <h2 className="m-auto">Похоже в категории {activeKind.title_rus} нет активных морф</h2>
                        </Col>
                    </Row>
                }
                {
                    genes.length > 0 ?
                        (
                            <React.Fragment>
                                <h2 className="mb-2">Морфы:</h2>
                                <Row className="mb-3">
                                    {
                                        genes.map( (item) => <MorphsItem key={item.title} title={item.title} traits={item.traits}/>)
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
                                                    <Link href="/[group]/[kind]/subcategories/[subcategoryTitle]" as={`/${group}/${kind}/subcategories/${toUrl(item.title)}`}>
                                                        <a className="d-flex justify-content-between align-items-center w-100">
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
                                                                                        <a className="d-flex justify-content-between align-items-center">
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
                {
                    genes.length > 0 &&
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
                }
                <Col xs={12} lg={7}>
                    <Link
                        href={"/[group]/[Kinds]"}
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
};

const mapStateToProps = ({kinds: {active: activeKinds, activeKind}}: IRootState): IMorphsStateProps => ({
    activeKinds,
    activeKind
});


const Morphs = connect<IMorphsStateProps>(mapStateToProps)(MorphsComponent);

export {
    Morphs
}
