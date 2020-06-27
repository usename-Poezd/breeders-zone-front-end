import React, { Component } from 'react';

import {Navbar, Nav, Form, Container, NavDropdown} from 'react-bootstrap';

import Link from 'next/link';
import {connect} from "react-redux";
import {
    clearSearch,
    clearSearchMorphResultIn,
    clearSearchMorphResultOut,
    deleteMorphIn,
    deleteMorphOut,
    setSearchAge,
    setSearchLocality, setSearchMaxMorphs,
    setSearchMinMorphs,
    setSearchMorphResultIn,
    setSearchMorphResultOut,
    setSearchPriceFrom,
    setSearchPriceTo,
    setSearchQuery,
    setSearchSelectedKind, setSearchSex, setSearchSubcategoryId,
    setSelectedMorphIn,
    setSelectedMorphOut,
    search as searchState, logout, clearUserNotificationsCount
} from "../../actions";
import Spinner from "../spinner";
import {isLogin as isLoginToken} from "../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faComments} from "@fortawesome/free-regular-svg-icons";
import {
    faBoxOpen,
    faDesktop,
    faEgg,
    faQuestionCircle, faShieldAlt, faSignOutAlt,
    faStore,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Pipes from "../../services/pipes";
import Search from "../search/search";
import LazyImg from "../lazy-img";
import Notifications from "../notifications/notifications";

class Header extends Component {

    state = {
        isToggle: false,
        selectMorphIdx: 0,
        searchMorphInValue: '',
        searchMorphOutValue: '',
        morphsInShow: false,
        morphsOutShow: false,
        searchOptions: '',
        isMobile: false,
        isSearch: false,
        isNotifications: false
    };
    pipes = new Pipes();

    componentDidMount() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        if (window.innerWidth < 992) {
            this.setState({isMobile: true});
        } else {
            this.setState({isMobile: false})
        }
    };

    onToggle = () => {
        this.setState( () => {
            const { isToggle } = this.state;

            return {
                isToggle: !isToggle
            }
        })
    };

    onToggleBurger = () => {
        this.setState({ isToggle: false });
    };

    renderNav = () => {
        const {isLogin, user, loginRequest, roomsWithNewMessages, logout, clearUserNotificationsCount} = this.props;
        const {isMobile, isNotifications} = this.state;

        if (isLogin && isLoginToken()  && !isMobile) {
            return  (
               <React.Fragment>
                   <Link href="/faq">
                       <Nav.Link as="a">FAQ</Nav.Link>
                   </Link>
                   <Link href="/guards">
                       <Nav.Link as="a">Хранители</Nav.Link>
                   </Link>
                   <Nav.Link
                       as={NavDropdown}
                       className="chat-link notifications"
                       style={{fontSize: 15}}
                       onClick={() => {
                           this.setState({isNotifications: true});
                           clearUserNotificationsCount()
                       }}
                       title={(
                           <React.Fragment>
                               {
                                   user.unread_notifications_count > 0 ?
                                       <span className="message-count" style={{right: -3}}>{user.unread_notifications_count}</span>
                                       : null
                               }
                               <FontAwesomeIcon icon={faBell} size="lg"/>
                           </React.Fragment>
                       )}
                   >
                       <Notifications show={isNotifications}/>
                   </Nav.Link>
                   <Link href="/chat">
                       <Nav.Link as="a" className="chat-link">
                           {
                               roomsWithNewMessages > 0 ?
                                   <span className="message-count">{roomsWithNewMessages}</span>
                                   : null
                           }
                           <FontAwesomeIcon icon={faComments} size="lg"/>
                       </Nav.Link>
                   </Link>
                   <NavDropdown title={user.name ? user.name : 'Вы'} id="nav-dropdown">
                       {
                           loginRequest ?
                               <Spinner size={15}/>
                               : (
                                   <React.Fragment>
                                       <Link href="/profile">
                                           <NavDropdown.Item as="a"  eventKey="4.1">
                                               Мой профиль
                                           </NavDropdown.Item>
                                       </Link>

                                            {
                                                user.is_breeder ?
                                                    (
                                                        <React.Fragment>
                                                            <Link href="/profile/shop">
                                                                <NavDropdown.Item as="a" eventKey="4.2">Профиль магазина</NavDropdown.Item>
                                                            </Link>
                                                            <Link href="/products">
                                                                <NavDropdown.Item as="a" eventKey="4.3">Мои товары</NavDropdown.Item>
                                                            </Link>
                                                            <Link href="/profile/divorces">
                                                                <NavDropdown.Item as="a" eventKey="4.4">Мои разводы</NavDropdown.Item>
                                                            </Link>
                                                        </React.Fragment>
                                                    )
                                                    : null
                                            }
                                            {
                                                user.is_guard ?
                                                    <Link href="/guard/dashboard">
                                                        <NavDropdown.Item as="a" eventKey="4.5">Рабочий стол хранителя</NavDropdown.Item>
                                                    </Link>
                                                    : null
                                            }

                                       <NavDropdown.Item onClick={() => logout()} eventKey="4.6">Выйти</NavDropdown.Item>
                                   </React.Fragment>
                               )
                       }
                   </NavDropdown>
               </React.Fragment>
            )
        }

        if (isLoginToken() && isMobile) {
            return (
                <React.Fragment>
                    <Link href="/faq" >
                        <a className="nav-link">
                            <span className="icon"><FontAwesomeIcon icon={faQuestionCircle} size="lg"/></span>
                            <span className="text">FAQ</span>
                        </a>
                    </Link>
                    <Link href="/guards" >
                        <a className="nav-link">
                            <span className="icon"><FontAwesomeIcon icon={faShieldAlt} size="lg"/></span>
                            <span className="text">Хранители</span>
                        </a>
                    </Link>
                    <Link href="/profile">
                        <Nav.Link as="a">
                            <span className="icon"><FontAwesomeIcon icon={faUserCircle} size="lg"/></span>
                            <span className="text">Мой профиль</span>
                        </Nav.Link>
                    </Link>
                    {
                        user.is_breeder ?
                            (
                                <React.Fragment>
                                    <Link href="/profile/shop">
                                        <Nav.Link as="a">
                                            <span className="icon"><FontAwesomeIcon icon={faStore} size="lg"/></span>
                                            <span className="text">Профиль магазина</span>
                                        </Nav.Link>
                                    </Link>
                                    <Link href="/products">
                                        <Nav.Link as="a">
                                            <span className="icon"><FontAwesomeIcon icon={faBoxOpen} size="lg"/></span>
                                            <span className="text">Мои товары</span>
                                        </Nav.Link>
                                    </Link>
                                    <Link href="/profile/divorces">
                                        <Nav.Link as="a">
                                            <span className="icon"><FontAwesomeIcon icon={faEgg} size="lg"/></span>
                                            <span className="text">Мои разводы</span>
                                        </Nav.Link>
                                    </Link>
                                </React.Fragment>
                            )
                            : null
                    }
                    {
                        user.is_guard ?
                            <Link href="/guard/dashboard">
                                <Nav.Link as="a">
                                    <span className="icon"><FontAwesomeIcon icon={faDesktop} size="lg"/></span>
                                    <span className="text">Рабочий стол хранителя</span>
                                </Nav.Link>
                            </Link>
                            : null
                    }
                    <Nav.Link onClick={() => logout()}>
                        <span className="icon"><FontAwesomeIcon icon={faSignOutAlt} size="lg"/></span>
                        <span className="text">Выйти</span>
                    </Nav.Link>
                </React.Fragment>
            )
        }

        if (!isLoginToken() && isMobile) {
            return (
                <React.Fragment>
                    <Link href="/faq" >
                        <a className="nav-link">
                            <span className="icon"><FontAwesomeIcon icon={faQuestionCircle} size="lg"/></span>
                            <span className="text">FAQ</span>
                        </a>
                    </Link>
                    <Link href="/guards" >
                        <a className="nav-link">
                            <span className="icon"><FontAwesomeIcon icon={faShieldAlt} size="lg"/></span>
                            <span className="text">Хранители</span>
                        </a>
                    </Link>
                    <Link href="/login">
                        <Nav.Link as="a"  className="btn btn-second">
                            Войти
                        </Nav.Link>
                    </Link>
                    <Link href="/registration">
                        <Nav.Link as="a"  className="btn btn-main">
                            Зарегестрироваться
                        </Nav.Link>
                    </Link>
                </React.Fragment>
            )
        }

        if (!isLoginToken()) {
            return (
                <React.Fragment>
                    <Link href="/faq">
                        <Nav.Link as="a">FAQ</Nav.Link>
                    </Link>
                    <Link href="/guards">
                        <Nav.Link as="a">Хранители</Nav.Link>
                    </Link>
                    <Link href="/login">
                        <Nav.Link as="a"  className="btn btn-second">
                            Войти
                        </Nav.Link>
                    </Link>
                    <Link href="/registration">
                        <Nav.Link as="a"  className="btn btn-main">
                            Зарегестрироваться
                        </Nav.Link>
                    </Link>

                </React.Fragment>
            );
        }
    };

    render(){
        const { isToggle, isNotifications } = this.state;
        const {
            roomsWithNewMessages,
            setSearchQuery,
            query,
            searchState,
            user
        } = this.props;


        return (
            <Container fluid as="header">
                <Navbar bg="light" expand="lg">
                    <Link href="/">
                        <Navbar.Brand as="a" >
                            <img src="/images/logo.svg" alt="Breeders Zone" className="logo"/>
                        </Navbar.Brand>
                    </Link>

                    <div className="d-flex align-items-center">
                        <Link href="/chat">
                            <a className="chat-icon">
                                {
                                    roomsWithNewMessages > 0 ?
                                        <span className="message-count">{roomsWithNewMessages}</span>
                                        : null
                                }
                                <FontAwesomeIcon icon={faComments} size="lg"/>
                            </a>
                        </Link>
                        <Nav.Link
                            as={NavDropdown}
                            className="chat-icon notifications m-0"
                            style={{fontSize: 13}}
                            onClick={() => {
                                this.setState({isNotifications: true});
                                clearUserNotificationsCount()
                            }}
                            title={(
                                <React.Fragment>
                                    {
                                        user.unread_notifications_count > 0 ?
                                            <span className="message-count"></span>
                                            : null
                                    }
                                    <FontAwesomeIcon icon={faBell}/>
                                </React.Fragment>
                            )}
                        >
                            <Notifications show={isNotifications}/>
                        </Nav.Link>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="btn shadow-none" onClick={this.onToggleBurger}>
                            <LazyImg src="/images/burger.svg" alt="Меню" className="img-fluid" />
                        </Navbar.Toggle>
                    </div>


                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="d-flex align-items-center">
                            <Form.Group className="m-md-0">
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск по..."
                                    value={query} className="form-control-border"
                                    onKeyDown={
                                        (e) => e.key === 'Enter' ?
                                            searchState()
                                            : null
                                    }
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="controls d-flex">
                                    <span className="more-icon d-flex" onClick={this.onToggle}>
                                        <img src="/images/more.svg" alt="Опции" className="img-fluid"/>
                                    </span>
                                    <span
                                        className="search-icon d-flex"
                                        onClick={() => {
                                            searchState()
                                        }}
                                    >
                                        <img src="/images/search.svg" alt="Поиск" className="img-fluid" />
                                    </span>
                                </div>
                            </Form.Group>
                        </Nav>

                        <Nav className="ml-auto d-flex align-items-start align-items-lg-center">
                            {
                                this.renderNav()
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Search isToggle={isToggle} onToggleBurger={this.onToggleBurger}/>
            </Container>
        );
    }
}


const mapStateToProps = ({
     auth: {isLogin, loginRequest},
     profile: {user},
     chat: {roomsWithNewMessages},
     search: {
         query,
         selectedKind,
         selectedLocalities,
         priceFrom,
         priceTo,
         searchMorphResultIn,
         morphsIn,
         searchMorphResultOut,
         morphsOut,
         minMorphs,
         maxMorphs,
         age,
         sex,
         subcategoryId
     },
     kinds: {all: allKinds}
}) => ({
    isLogin,
    loginRequest,
    user,
    roomsWithNewMessages,
    allKinds,

    query,
    selectedKind,
    selectedLocalities,
    priceFrom,
    priceTo,
    searchMorphResultIn,
    morphsIn,
    searchMorphResultOut,
    morphsOut,
    minMorphs,
    maxMorphs,
    age,
    sex,
    subcategoryId
});

export default connect(mapStateToProps, {
    setSearchQuery,
    setSearchSelectedKind,
    setSearchLocality,
    setSearchPriceFrom,
    setSearchPriceTo,
    setSearchMorphResultIn,
    setSelectedMorphIn,
    deleteMorphIn,
    clearSearchMorphResultIn,
    setSearchMorphResultOut,
    setSelectedMorphOut,
    deleteMorphOut,
    clearSearchMorphResultOut,
    setSearchMinMorphs,
    setSearchMaxMorphs,
    setSearchSex,
    setSearchAge,
    setSearchSubcategoryId,
    clearSearch,
    searchState,
    logout,
    clearUserNotificationsCount
})(Header);
