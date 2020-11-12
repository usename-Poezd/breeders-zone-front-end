import React, {FC, useState} from 'react';
import {Col, Dropdown, Row} from 'react-bootstrap';
import Link from "next/link";
import Slider from "react-slick";
import {connect, useStore} from "react-redux";
import {num2str, toUrl} from "../../../../utils";
import LazyImg from "../../../lazy-img";
import {compareMorph} from "../../../../utils";
import {IRootState} from "../../../../redux/store";
import {Filter, IOption} from "../../../Filter";
import {FilterPropsType} from "./types";
const qs = require('qs');

const FilterResult: FC<FilterPropsType> = (props) => {
    const {kinds: {activeKind}}: IRootState = useStore().getState();
    const [sliderDrag, setSliderDrag] = useState<boolean>(false);

    const filterOptions: Array<IOption> = [
        {value: '-price', label: <div><LazyImg src={"/images/filter-up-icon.svg"} className="img-fluid"/>По цене</div>},
        {value: 'price', label: <div><LazyImg src={"/images/filter-up-icon.svg"} className="img-fluid rotated"/>По цене</div>},
        {value: '-created_at', label: <div><LazyImg src={"/images/filter-up-icon.svg"} className="img-fluid"/>По новизне</div>},
        {value: 'created_at', label: <div><LazyImg src={"/images/filter-up-icon.svg"} className="img-fluid rotated"/>По новизне</div>}
    ];


    const { morphs = [], localities = [], total } = props;
    const sliderOptions = {
        dots: false,
        infinite: true,
        arrows: false,
        centerMode: true,
        speed: 500,
        slidesToShow: 2,
        swipeToSlide: true,
        initialSlide: 0,
    };

    return (
        <Row className="top-filter-and-result d-flex justify-content-between align-items-center">
            <Col xs={12} md={6} className="result">
                <h3>{num2str(total, ['Найден', 'Найденно', 'Найденно'])} {total} {num2str(total, ['результат', 'результата', 'результатов'])}</h3>

                {
                    morphs.length <= 2 && morphs.length !== 0?
                        (
                            <React.Fragment>
                                <h3 className="mb-1">С { morphs.length > 1 ? 'морфами' : 'морфой' }</h3>
                                <div className="result-morphs morphs morph w-75 align-items-center">
                                    {
                                        morphs.map( ({gene_title, trait_title, label, type}, idx) => {

                                            const traitTitleUrl = label ? label : trait_title;

                                            if (activeKind) {
                                                return (
                                                    <Link
                                                        key={"morph-exists" + idx}
                                                        href={`/[group]/[kind]/${trait_title ? 'morphs' : 'genes'}/${trait_title ? '[morph]' : '[geneTitle]'}`}
                                                        as={`/${toUrl(activeKind.group)}/${toUrl(activeKind.title_eng)}/${trait_title ? 'morphs' : 'genes'}/${toUrl(trait_title ? `${traitTitleUrl} ${gene_title}` : gene_title)}`}
                                                    >
                                                        <a
                                                            className={
                                                                `morph-indicator text-nowrap morph-${type && trait_title ? type : 'other' }-${trait_title ? toUrl(traitTitleUrl) : 'normal'}`
                                                            }
                                                        >
                                                            {
                                                                trait_title && gene_title ?
                                                                    compareMorph(trait_title, gene_title)
                                                                    : gene_title
                                                            }
                                                        </a>
                                                    </Link>
                                                )
                                            }

                                            return (
                                                <div
                                                    key={"morph-exists" + idx}
                                                    className={
                                                        `morph-indicator text-nowrap morph-${type && trait_title ? type : 'other' }-${trait_title ? toUrl(traitTitleUrl) : 'normal'}`
                                                    }
                                                >
                                                    {
                                                        trait_title && gene_title ?
                                                            compareMorph(trait_title, gene_title)
                                                            : gene_title
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </React.Fragment>
                        )
                        : null
                }
                {
                    morphs.length > 2 && morphs.length <= 9 ?
                        (
                            <React.Fragment>
                                <h3 className="mb-1">С { morphs.length > 1 ? 'морфами' : 'морфой' }</h3>
                                <div
                                    style={{
                                        cursor: sliderDrag ? 'grabbing' : 'grab'
                                    }}
                                    className="result-morphs morph w-75 align-items-center"
                                    onMouseDown={() => setSliderDrag(true)}
                                    onMouseUp={() => setSliderDrag(false)}
                                >
                                    <Slider {...sliderOptions}>
                                        {
                                            morphs.map( ({gene_title, trait_title, type, label}, idx) => {
                                                const traitTitleUrl = label ? label : trait_title;
                                                if (activeKind.title_eng) {
                                                    return (
                                                        <Link
                                                            key={"morph-exists" + idx}
                                                            href={`/[group]/[kind]/${trait_title ? 'morphs' : 'genes'}/${trait_title ? '[morph]' : '[geneTitle]'}`}
                                                            as={`/${toUrl(activeKind.group)}/${toUrl(activeKind.title_eng)}/${trait_title ? 'morphs' : 'genes'}/${toUrl(trait_title ? `${trait_title} ${gene_title}` : gene_title)}`}
                                                        >
                                                            <a
                                                                className={
                                                                    `morph-indicator text-nowrap morph-${type && trait_title ? type : 'other' }-${trait_title ? toUrl(traitTitleUrl) : 'normal'}`
                                                                }
                                                            >
                                                                {
                                                                    trait_title && gene_title ?
                                                                        compareMorph(trait_title, gene_title)
                                                                        : gene_title
                                                                }
                                                            </a>
                                                        </Link>
                                                    )
                                                }

                                                return (
                                                    <div
                                                        key={"morph-exists" + idx}
                                                        className={
                                                            `morph-indicator text-nowrap morph-${type && trait_title ? type : 'other' }-${trait_title ? toUrl(traitTitleUrl) : 'normal'}`
                                                        }
                                                    >
                                                        {
                                                            trait_title && gene_title ?
                                                                compareMorph(trait_title, gene_title)
                                                                : gene_title
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </Slider>
                                </div>
                            </React.Fragment>
                        )
                        : null
                }

                {
                    localities.length > 0 ?
                        (
                            <div
                                className="result-morphs morph w-75"
                            >
                                <h3>С {num2str(localities.length, ['локалитетом', 'локалитетами'])}</h3>
                                <div className="morphs">
                                    {
                                        localities.map( ({title}) => (
                                            <div className="morph-indicator morph-other-normal">
                                                {title}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                        : null
                }
            </Col>

            <Col xs={12} md={6} className="d-flex justify-content-md-end justify-content-start filter-container">
                <Filter
                    name="sort"
                    id="filter"
                    autoSize
                    className="filter"
                    placeholder="Выберите фильтрацию"
                    options={filterOptions}
                />
            </Col>
        </Row>
    );
};

export {
    FilterResult
};
