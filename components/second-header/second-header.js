import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Link from 'next/link';
import { connect } from 'react-redux';
import {Pipes} from "../../services";
import {withRouter} from "next/router";
import {setActiveKind} from "../../actions";
import {ucFirst} from "../../utils";
import Dropdown, {DropdownItem} from "../dropdown";

class SecondHeader extends Component {
    pipes = new Pipes();

    state = {
        location: {
            home: false,
            morphs: false,
            shops: false,
            none: false
        },
    };

    componentDidMount(){
        this.isTab();
    }

    componentDidUpdate(prevProps) {
        if (this.props.router.query !== prevProps.router.query) {
            const {setActiveKind, allKinds, router} = this.props;

            this.setState({
                location: {
                    home: false,
                    morphs: false,
                    shops: false
                }
            });
            this.isTab();

            if(router.query.kind) {
                const regExp = new RegExp(router.query.kind.replace('-', ' '), 'gi');
                const activeKind = allKinds.find((item) => item.title_eng.match(regExp));
                if (activeKind)
                    setActiveKind(activeKind);
            }
        }
    }


    isTab = () => {
        const { pathname } = this.props.router;

        switch(pathname){
            case "/[group]/[kind]/home":
                this.setState( ()=> {
                    return {
                        location: {
                            home: true
                        }
                    }
                });
                break;

            case "/[group]/[kind]/morphs":
                this.setState( ()=> {
                    return {
                        location: {
                            morphs: true
                        }
                    }
                });
                break;

            case "/shops/[shopName]":
                this.setState( ()=> {
                    return {
                        location: {
                            shops: true
                        }
                    }
                });
                break;

            case "/shops":
                this.setState( ()=> {
                    return {
                        location: {
                            shops: true
                        }
                    }
                });
                break;
        }
    };

    render() {
        const { activeKinds, router: {pathname, query}, setActiveKind, activeKind} = this.props;
        const { location } = this.state;
        const { morphs, shops} = location;

        if (
            location.none
        ){
            return null;
        }

        return (
            <nav className="nav flex-column">
                <div className="titles">
                    {
                        pathname === '/shops'
                        || pathname === '/shops/[shopName]'
                        || pathname === '/'
                        || pathname === '/[group]/[kind]/[id]' ?
                            <React.Fragment>
                                <h2 className="h1 title">{activeKind.title_rus  ? activeKind.title_rus : query.group ? ucFirst(query.group) : 'Рептилии'}</h2>
                                <h2 className="h1 title_latina">{activeKind.title_eng ? activeKind.title_eng : `${query.group ? `${ucFirst(query.group)} в продаже` : ''}`}</h2>
                            </React.Fragment>
                            : <React.Fragment>
                                <h1 className="title">{activeKind.title_rus  ? activeKind.title_rus : query.group ? ucFirst(query.group) : 'Рептилии'}</h1>
                                <h2 className="title_latina">{activeKind.title_eng ? activeKind.title_eng : `${query.group ? `${ucFirst(query.group)} в продаже` : ''}`}</h2>
                            </React.Fragment>
                    }

                </div>

                <Container>
                    <Row className="nav-container flex-column">
                        <Col xs={12} sm={8} md={6} className="select-block mx-auto">
                            <Dropdown
                                as="nav"
                                label={
                                    activeKind.title_rus ?
                                        activeKind.title_rus
                                        : 'Выберите категорию'
                                }
                                variant="white"
                            >
                                {
                                    activeKinds.map( (item) => (
                                        <DropdownItem
                                            key={`${item.title_eng}-${item.id}`}
                                            onClick={
                                                (e) => {
                                                    setActiveKind(item);
                                                }
                                            }>
                                            <Link href="/[group]/[kind]/morphs" as={`/${item.group}/${this.pipes.toUrl(item.title_eng)}/morphs`}>
                                                <a>
                                                    {item.title_rus}
                                                </a>
                                            </Link>
                                        </DropdownItem>
                                    ))
                                }
                            </Dropdown>
                        </Col>

                        {
                            pathname !== '/' && activeKind.title_eng ?
                                (
                                    <Col xs={12} lg={6} as={Row} className="nav-main m-auto justify-content-center">
                                        {/*<Col xs={4}>*/}
                                        {/*    <div className={"nav-main-item " + (home ? "actived" : "")}>*/}
                                        {/*        <Link href="/[group]/[kind]/home" as={`/${activeKind.group}/${this.pipes.toUrl(activeKind.title_eng)}/home`}>*/}
                                        {/*            <a className="h3">*/}
                                        {/*                На главную*/}
                                        {/*            </a>*/}
                                        {/*        </Link>*/}
                                        {/*    </div>*/}
                                        {/*</Col>*/}
                                        <Col xs={4}>
                                            <div className={"nav-main-item " + (morphs ? "actived" : "")}>
                                                <Link href="/[group]/[kind]/morphs" as={`/${activeKind.group}/${this.pipes.toUrl(activeKind.title_eng)}/morphs`}>
                                                    <a className="h3">
                                                        Морфы
                                                    </a>
                                                </Link>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className={"nav-main-item " + (shops ? "actived" : "")}>
                                                <Link href={"/shops?kind=" + this.pipes.toUrl(activeKind.title_eng)}>
                                                    <a className="h3">Магазины</a>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Col>
                                )
                                : null
                        }
                    </Row>
                </Container>

                <div className="bg" style={{
                    background: "url('https://breeders-zone.s3.us-east-2.amazonaws.com/static/images/header.jpg')"
                }}>
                    <div className="bg-img">
                        <img src={activeKind.logo_header ? activeKind.logo_header : 'https://breeders-zone.s3.us-east-2.amazonaws.com/static/images/header.jpg'} alt={activeKind.title_rus}/>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = ({kinds: {all: allKinds, active: activeKinds, activeKind}, router: {location: {pathname}}}) => ({
    activeKinds,
    pathname,
    activeKind,
    allKinds
});

export default connect(mapStateToProps, {setActiveKind})( withRouter(SecondHeader) );
