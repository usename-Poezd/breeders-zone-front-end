import React, {Component} from "react";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {withGetData} from "../../hoc-helpers";
import GuardDashboardProductItem from "../guard-dashboard-product-item";

import Spinner from "../../spinner";
import {connect} from "react-redux";
import {setUserGuardXP} from "../../../actions";
import {isLogin} from "../../../utils";
import shop from "../../../reducers/shop";
import ShopDivorcesItem from "../../shop-divorces-item/shop-divorces-item";
import GuardDashboardDivorceItem from "../guard-dashboard-divorce-item";
import Axios from "axios";
import {withRouter} from "next/router";
const qs = require('qs');


class GuardDashboard extends Component {

    state = {
        search: {
            q: '',
            kindTitle: ''
        },
        products: [],
        divorces: [],
        productRequest: false,
        divorceRequest: false,
        activeTab: 'products',
        prevCancelToken: null
    };

    searchInput = React.createRef();

    componentDidMount() {
        if (this.props.user.id) {
            this.updateDashboard()
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.router !== this.props.router || prevProps.user.id !== this.props.user.id || prevState.activeTab !== this.state.activeTab) {
            this.updateDashboard()
        }
    }

    updateDashboard = () => {
        const { getDivorces, getProducts, router, user } = this.props;
        const { prevCancelToken, activeTab } = this.state;

        this.setState({
            search: {
                q: router.query.q,
                kindTitle: router.query.kindTitle ? router.query.kindTitle : ''
            }
        });

        const CancelToken = Axios.CancelToken;
        const source = CancelToken.source();



        switch (activeTab) {
            case 'products':
                this.setState({productRequest: true});
                getProducts({
                    guardId: user.id,
                    kindsIn: user.guardians_kinds.map( (item) => item.id)
                }, qs.stringify(router.query), source.token, prevCancelToken)
                    .then((data) => this.setState({
                        products: data.products.data,
                        divorces: [],
                        productRequest: false
                    }))
                    .catch( (error) => this.setState({productRequest: false}));
                break;


            case 'divorces':
                this.setState({divorceRequest: true});
                getDivorces({
                    kindsIn: user.guardians_kinds.map( (item) => item.id),
                    verified: false
                }, qs.stringify(router.query), source.token, prevCancelToken)
                    .then((data) => this.setState({
                        products: [],
                        divorces: data.data,
                        divorceRequest: false
                    }))
                    .catch( (error) => this.setState({divorceRequest: false}));
                break;
        }

        this.setState({prevCancelToken: source})
    };

    clearSearch = () => {
        const {router} = this.props;
        this.setState({
            search: {
                q: '',
                kindTitle: ''
            }
        });

        router.push('/guard/dashboard');
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {router} = this.props;
        const {search} = this.state;

        if (!!search.kindTitle) {
            return router.push('/guard/dashboard' + '?' + qs.stringify(search))
        }
        history.push('?q=' + search.q);
        this.searchInput.current.value = '';
    };

    checkEmpty = () => {
        const {
            products,
            divorces,
            productRequest,
            divorceRequest
        } = this.state;
        const {router} = this.props;
        const {q, kindTitle} = router.query;

        if (q && kindTitle && products.length === 0 && divorces.length === 0 && !productRequest && !divorceRequest) {
            return (
                <React.Fragment>
                    <p className="text-center ">По запросу <span className="h-3 d-inline">{q}</span> и категорией <span className="h-3">{kindTitle}</span> ничего не найдено.</p>
                    <p className="text-center clear-query" onClick={this.clearSearch}>Очистить.</p>
                </React.Fragment>
            );
        }else if (q && products.length === 0 && divorces.length === 0 && !productRequest && !divorceRequest) {
            return (
                <React.Fragment>
                    <p className="text-center">По запросу <span className="h-3 d-inline">{q}</span> ничего не найдено.</p>
                    <p className="text-center clear-query" onClick={this.clearSearch}>Очистить.</p>
                </React.Fragment>
            );
        } else if (kindTitle && products.length === 0 && divorces.length === 0 && !productRequest && !divorceRequest) {
            return (
                <React.Fragment>
                    <p className="text-center">По запросу c категорией <span className="h-3 d-inline">{kindTitle}</span> ничего не найдено.</p>
                    <p className="text-center clear-query" onClick={this.clearSearch}>Очистить.</p>
                </React.Fragment>
            );
        }
    };

    checkKindTitle = (e) => {
        const {router} = this.props;
        const filteredValue = e.target.value !== 'all' ? e.target.value : '';

        this.setState({
                search: {
                    q: this.state.search.q,
                    kindTitle: filteredValue
                }
        });



        router.push('/guard/dashboard' + '?' + qs.stringify({...this.state.search, kindTitle: filteredValue}));
    };

    setSearch = (e) => {
        this.setState({
            search: {
                kindTitle: this.state.search.kindTitle,
                q: e.target.value
            }
        });
    };

    onVerify = (id) => {
        const {verifyProduct, verifyDivorce, setUserGuardXP} = this.props;
        const {activeTab, products, divorces} = this.state;


        switch (activeTab) {
            case "products":
                verifyProduct(id);
                const productIdx = products.findIndex((item) => item.id === id);
                products.splice(productIdx, 1);
                this.setState({
                    products
                });
                break;
            case "divorces":
                verifyDivorce(id);
                const divorceIdx = divorces.findIndex((item) => item.id === id);
                divorces.splice(divorceIdx, 1);
                this.setState({
                    divorces
                });
                break;
        }

        setUserGuardXP();
    };

    render() {
        const {router, loginRequest, user: {guardians_kinds = [], is_guard, guard_level: {level, title: levelTitle}, guard_XP}} = this.props;
        const {products, search: {kindTitle}, productRequest, divorceRequest, activeTab, divorces} = this.state;
        const params = router.query;
        let XPStyle = {};

        if (loginRequest) {
            return <Spinner/>
        }

        if ((!is_guard || !isLogin()) && typeof window !== 'undefined'){
            return router.push('/');
        }

        if (guard_XP > 0 && guard_XP > 50) {
            XPStyle = {
                left: ((100 * guard_XP) / 1000) - 7 + '%'
            }
        }

        return (
            <Row className="dashboard">
                <Col xs={12}>
                    <nav className="dashboard-nav">
                        <span
                            className={activeTab === 'products' ? 'active' : ''}
                            onClick={() => this.setState({activeTab: 'products'})}
                        >
                            Животные
                        </span>
                        <span
                            className={activeTab === 'divorces' ? 'active' : ''}
                            onClick={() => this.setState({activeTab: 'divorces'})}
                        >
                            Разводы
                        </span>
                    </nav>
                </Col>
                <Col xs={12} md={8}>
                    <Form onSubmit={this.onSubmit} className="dashboard-filter d-flex">
                        <div className="dashboard-search-container">
                            <Form.Control
                                className="dashboard-search feather-shadow"
                                placeholder="Поиск..."
                                onChange={this.setSearch}
                                ref={this.searchInput}
                            />
                            <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={this.onSubmit}/>
                        </div>
                        <div className="dashboard-select select-wrap" >
                            <Form.Control
                                as="select"
                                onChange={this.checkKindTitle}
                                value={kindTitle}
                            >
                                <option value="all">Все</option>
                                {
                                    guardians_kinds.map( (item) =><option key={item.id} value={item.title_eng}>{item.title_rus}</option> )
                                }
                            </Form.Control>
                        </div>
                    </Form>
                    <div className="dashboard-body position-relative d-flex flex-column">
                        {
                            ((products.length === 0 && !productRequest) || (divorces.length === 0 && !divorceRequest)) && ( params.q || params.kindTitle) ?
                                this.checkEmpty()
                                : null
                        }
                        {
                            products.length === 0 && !productRequest && !params.q && !params.kindTitle && activeTab === 'products' ?
                                <p>Замечательно, для вас нет товаров для оценки.</p>
                                : null
                        }
                        {
                            divorces.length === 0 && !divorceRequest && !params.q && !params.kindTitle && activeTab === 'divorces' ?
                                <p>Замечательно, для вас нет разводов для оценки.</p>
                                : null
                        }
                        {
                            divorceRequest && divorces.length === 0 ?
                                <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                : null

                        }
                        {
                            productRequest && products.length === 0 ?
                            <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                            : null

                        }
                        {
                            divorceRequest &&  divorces.length > 0 ?
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }
                        {
                            productRequest &&  products.length > 0 ?
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }
                        {
                            activeTab === 'products' ?
                                products.map((item, ) => <GuardDashboardProductItem key={`product-${item.id}`} onVerify={this.onVerify} {...item}/>)
                                : divorces.map((item) => <GuardDashboardDivorceItem key={`divorce-${item.id}`} onVerify={this.onVerify} {...item} />)
                        }
                    </div>
                </Col>
                <Col xs={0} md={4}>
                    <div className="feather-shadow reward">
                        <div className="reward-block">
                            <img src="https://i.dlpng.com/static/png/49182_preview.png" alt="" className="img-fluid"/>
                            <h2 className="text-center">{levelTitle}</h2>
                            <p className="text-center">До следуйщего уровня нужно набрать 1000 XP</p>
                        </div>
                        <div className="progress">
                            <div
                                className="progress-start"
                                style={XPStyle}
                            ></div>
                            <div
                                className="progress-bar"
                                style={{width: ((100 * guard_XP) / 1000) + '%'}}
                            ></div>
                            <div className="progress-end"><span className="h3">{level + 1}</span></div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h3>{guard_XP} XP</h3>
                            <h3>1000 XP</h3>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}

const mapMethodsToProps = ({getProducts, verifyProduct, getDivorces, verifyDivorce}) => ({
    getProducts,
    verifyProduct,
    getDivorces,
    verifyDivorce
});

const mapStateToProps = ({profile: {user}, auth: {loginRequest, isLogin}}) => ({
    user,
    loginRequest,
    isLogin
});

export default connect(mapStateToProps, {setUserGuardXP})(
    withRouter(
        withGetData(GuardDashboard, mapMethodsToProps)
    )
);
