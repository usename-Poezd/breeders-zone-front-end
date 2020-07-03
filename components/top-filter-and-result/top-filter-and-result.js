import React, { Component } from 'react';

import filterUp from "./fliterUpIcon.svg"
import {Col, Dropdown, Row} from 'react-bootstrap';
import {withRouter} from "next/router";
import Link from "next/link";
import Slider from "react-slick";
import {Pipes} from "../../services";
const qs = require('qs');
import {connect} from "react-redux";
import {num2str} from "../../utils";
import LazyImg from "../lazy-img";

class TopFilterAndResult extends Component {
    state = {
        active: 0,
        activeText: 'Выберите фильтрацию',
        activeImg: null,
        redirectOption: null,
        sliderDrag: false
    };

    pipes = new Pipes();

    componentDidMount() {
        const {router: {query, asPath}, pathname} = this.props;

        if (query.price) {
            switch (query.price) {
                case "desc":
                    this.checkSort(1);
                    break;
                case "asc":
                    this.checkSort(2);
                    break;
                default:
                    this.props.router.push(pathname);
            }

            return;
        }

        if (query.created) {
            switch (query.created) {
                case "desc":
                    this.checkSort(3);
                    break;
                case "asc":
                    this.checkSort(4);
                    break;
                default:
                    this.props.router.push(pathname);
            }
        }
    }

    setActive = (id) =>{
        const {router, search, pathname, changeRequest} = this.props;
        const {query} = router;
        const params = qs.parse(search.replace('?', ''));

        switch (id) {
            case 1:
                params.price = 'desc';
                if (params.created)
                    delete params.created;
                router.push(router.pathname, pathname + '?' + qs.stringify(params));
                break;
            case 2:
                params.price = 'asc';
                if (params.created)
                    delete params.created;
                router.push(router.pathname, pathname + '?' + qs.stringify(params));
                break;
            case 3:
                params.created = 'desc';
                if (params.price)
                    delete params.price;
                router.push(router.pathname, pathname + '?' + qs.stringify(params));
                break;
            case 4:
                params.created = 'asc';
                if (params.price)
                    delete params.price;
                router.push(router.pathname, pathname + '?' + qs.stringify(params));
                break;
        }

        changeRequest();
        this.setState({ active: id });
        this.checkSort(id);
    };

    checkSort = (activeId) => {
        switch(activeId){
            case 1:
                this.setState({
                    activeText: 'По цене',
                    activeImg:  'up',
                    redirectOption: 'price_up'
                });
                break;
            case 2:
                this.setState({
                    activeText: 'По цене',
                    activeImg:  'down',
                    redirectOption: 'price_down'
                });
                break;
            case 3:
                this.setState({
                    activeText: 'По новизне',
                    activeImg:  'up',
                    redirectOption: 'new_up'
                });
                break;
            case 4:
                this.setState({
                    activeText: 'По новизне',
                    activeImg:  'down',
                    redirectOption: 'new_down'
                });
                break;
        }
    };

    render() {
        const { activeText, activeImg, sliderDrag } = this.state;
        const { morphs = [], localities = [], total } = this.props;
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
                                            morphs.map( ({geneTitle, traitTitle, type}, idx) => (
                                                <div
                                                    key={"morph-exists" + idx}
                                                    className={
                                                        `morph-indicator text-nowrap morph-${type && traitTitle ? type : 'other' }-${traitTitle ? this.pipes.toUrl(traitTitle) : 'normal'}`
                                                    }
                                                >
                                                    {
                                                        traitTitle && geneTitle ?
                                                            `${traitTitle} ${geneTitle}`
                                                            : geneTitle
                                                    }
                                                </div>
                                            ))
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
                                        onMouseDown={() => this.setState({sliderDrag: true})}
                                        onMouseUp={() => this.setState({sliderDrag: false})}
                                    >
                                        <Slider {...sliderOptions}>
                                            {
                                                morphs.map( ({geneTitle, traitTitle, type}, idx) => (
                                                    <div
                                                        key={"morph-dont-exists" + idx}
                                                        className={
                                                            `morph-indicator text-nowrap morph-${type && traitTitle ? type : 'other' }-${traitTitle ? this.pipes.toUrl(traitTitle) : 'normal'}`
                                                        }
                                                    >
                                                        {
                                                            traitTitle && geneTitle ?
                                                                `${traitTitle} ${geneTitle}`
                                                                : geneTitle
                                                        }
                                                    </div>
                                                ))
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
                    <Dropdown className="filter" alignRight={false}>
                        <Dropdown.Toggle as="button" id="dropdown-basic" className="btn">
                            <LazyImg src={filterUp} className={`img-fluid ${ activeImg === 'down' ? 'rotated' : '' }`}/>
                            {activeText}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.setActive(1)}><LazyImg src={filterUp} className="img-fluid"/>По цене</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setActive(2)}><LazyImg src={filterUp} className="img-fluid rotated"/>По цене</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setActive(3)}><LazyImg src={filterUp} className="img-fluid"/>По новизне</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setActive(4)}><LazyImg src={filterUp} className="img-fluid rotated"/>По новизне</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = ({router: {location: {search, pathname}}}) => ({
    search, pathname
});

export default connect(mapStateToProps)(
    withRouter(TopFilterAndResult)
);
