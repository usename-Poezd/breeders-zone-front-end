import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Link from 'next/link';
import { connect } from 'react-redux';
import {Pipes} from "../../services";
import {withRouter} from "next/router";
import {setActiveKind} from "../../actions";
import {route} from "next/dist/next-server/server/router";

class SecondHeader extends Component {

    dropdownList = React.createRef();
    pipes = new Pipes();

    state = {
        dropdown: false,
        location: {
            home: false,
            morphs: false,
            shops: false,
            none: false
        },
        dropdownHeight: 0
    };

    componentDidMount(){
        this.isTab();


        this.updateDropdownHeight();
    }

    componentDidUpdate(prevProps) {
        if (this.props.router.query !== prevProps.router.query) {
            this.setState({
                location: {
                    home: false,
                    morphs: false,
                    shops: false
                }
            });
            this.isTab();
        }

        if (prevProps.activeKinds !== this.props.activeKinds) {
            this.updateDropdownHeight();
        }
    }


    isTab = () => {
        const { pathname } = this.props.router;

        switch(pathname){
            case "/[group]/[kind]/home":
                this.setState( ()=> {
                    const { home } = this.state.location;

                    return {
                        location: {
                            home: !home
                        }
                    }
                });
                break;

            case "/[group]/[kind]/morphs":
                this.setState( ()=> {
                    const { morphs } = this.state.location;

                    return {
                        location: {
                            morphs: !morphs
                        }
                    }
                });
                break;

            case "/shops/[shopName]":
                this.setState( ()=> {
                    const { shops } = this.state.location;

                    return {
                        location: {
                            shops: !shops
                        }
                    }
                });
                break;
        }
    };

    dropdownUp = () =>{
        this.setState( (state) =>{
            const { dropdown } = state;

            return {
                dropdown: !dropdown
            }
        });
    };

    updateDropdownHeight = () => {
        const dropdownHeight = this.dropdownList.current.clientHeight;

        this.setState({ dropdownHeight: dropdownHeight });
    };

    render() {
        const { activeKinds, router: {route}, pathname, setActiveKind, activeKind} = this.props;
        const { dropdown, location, dropdownHeight } = this.state;
        const { home, morphs, shops} = location;

        if (
            location.none
        ){
            return null;
        }

        const idDropdown = !dropdown ? 'dropdown-list hidden' : 'dropdown-list';
        const isRotate = dropdown ? 'rotated' : '';

        return (
            <nav className="nav flex-column">
                <div className="titles">
                    <h1 className="title">{activeKind.title_rus}</h1>
                    <h1 className="title_latina">{activeKind.title_eng}</h1>
                </div>

                <Container>
                    <Row className="nav-container flex-column">
                        <Col xs={12} sm={8} md={6} className="select-block mx-auto">
                            <div className="dropdown-actived" onClick={this.dropdownUp} ref={this.dropdown}>
                                <span className="dropdown-actived-span">
                                    {
                                        activeKind.title_rus ?
                                            activeKind.title_rus
                                            : 'Выберите категорию'
                                    }
                                </span>
                                <img src="/images/arrow-white.svg" className={'arrow img-fluid ' + isRotate} alt="arrow"/>
                            </div>
                            <ul className={idDropdown} style={{bottom: `-${dropdownHeight}px`, zIndex: dropdown ? 9999 : -1}} ref={this.dropdownList}>
                                {
                                    activeKinds.map( (item) => (
                                        <li
                                            key={`${item.title_eng}-${item.id}`}
                                            onClick={
                                                (e) => {
                                                    this.dropdownUp(e);
                                                    setActiveKind(item);
                                                }
                                            }>
                                            <Link href="/[group]/[kind]/morphs" as={`/${item.group}/${this.pipes.toUrl(item.title_eng)}/morphs`}>
                                                <a>
                                                    {item.title_rus}
                                                </a>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Col>

                        {
                            pathname !== '/' && pathname !== '/search' && activeKind.title_eng ?
                                (
                                    <Col xs={12} lg={6} as={Row} className="nav-main m-auto">
                                        <Col xs={4}>
                                            <div className={"nav-main-item " + (home ? "actived" : "")}>
                                                <Link href="/[group]/[kind]/home" as={`/${activeKind.group}/${this.pipes.toUrl(activeKind.title_eng)}/home`}>
                                                    <a className="h3">
                                                        На главную
                                                    </a>
                                                </Link>
                                            </div>
                                        </Col>
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
                                                <a className="h3">Магазины</a>
                                            </div>
                                        </Col>
                                    </Col>
                                )
                                : null
                        }
                    </Row>
                </Container>

                <div className="bg">
                    <div className="bg-img"></div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = ({kinds: {active: activeKinds, activeKind}, router: {location: {pathname}}}) => ({
    activeKinds,
    pathname,
    activeKind
});

export default connect(mapStateToProps, {setActiveKind})( withRouter(SecondHeader) );
