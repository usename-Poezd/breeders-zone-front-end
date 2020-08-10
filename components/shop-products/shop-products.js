import React, {Component} from "react";
import ShopProductsItem from "../shop-products-item";
import Link from "next/link";
import {withRouter} from "next/router";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import withGetData from "../hoc-helpers/with-get-data";
import {connect} from "react-redux";
import {clearShopProducts, setShopProducts, setShopProductsRequest} from "../../actions";
import Spinner from "../spinner";
import qs from 'qs';

class ShopProducts extends Component {

    select = React.createRef();

    state = {
        isMobile: false,
        options: {
            q: ''
        },
        selectStyle: {
            width: '150px'
        }
    };

    searchInput = React.createRef();

    componentDidMount() {
        if (window.innerWidth <= 576) {
            this.setState({isMobile: true})
        }
        window.addEventListener('resize', this.onResize);
        this.updateProducts({...this.state.options, ...this.props.router.query});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.query !== this.props.router.query) {
            this.updateProducts({...this.state.options, ...this.props.router.query});
        }
    }

    componentWillUnmount() {
        const { clearShopProducts } = this.props;
        window.removeEventListener('resize', this.onResize);
        clearShopProducts();
    }

    updateProducts = (options = {}) => {
        const { getShopProducts, setShopProducts, setShopProductsRequest } = this.props;
        setShopProductsRequest();
        getShopProducts(options)
            .then( ({products}) => setShopProducts(products));
    };

    onResize = () => {
        const { isMobile } = this.state;
       if (window.innerWidth <= 576) {
           return this.setState({isMobile: true})
       }

       if (isMobile) {
           this.setState({isMobile: false})
       }
    };

    onChangeKinds = (e) => {
        const {router, setShopProductsRequest} = this.props;
        const newQuery = router.query;
        if (e.target.value !== 'all') {
            delete newQuery.q;
            newQuery.kindId = e.target.value;
            setShopProductsRequest();
            router.push(router.pathname + '?' + qs.stringify(newQuery));
        }

        if (e.target.value === 'all' && router.query.kindId !== null) {
            delete newQuery.q;
            delete  newQuery.kindId;
            setShopProductsRequest();
            router.push(router.pathname + '?' + qs.stringify(newQuery));
        }

        let textLength = 0;
        const node = this.select.current.childNodes[0];
        node.childNodes.forEach( (item) => {
            if (item.value == e.target.value) {
                textLength = item.textContent.length;
            }
        });

        if (textLength <= 12) {
            return this.setState({
                selectStyle: {
                    width: '150px'
                }
            });
        }
        if (textLength <= 19) {
            return this.setState({
                selectStyle: {
                    width: '210px'
                }
            });
        }
        if (textLength <= 12) {
            return this.setState({
                selectStyle: {
                    width: '150px'
                }
            });
        }
        if (textLength <= 28) {
            return this.setState({
                selectStyle: {
                    width: '290px'
                }
            });
        }

        return this.setState({
            selectStyle: {
                width: '310px'
            }
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {router, search: routerSearch} = this.props;
        const {options} = this.state;
        const query = qs.parse(routerSearch.replace('?', ''));
        query.q = options.q;

        router.push('/products?' + qs.stringify(query));
        this.searchInput.current.value = '';
    };


    setSearch = (e) => {
        this.setState({
            options: {
                q: e.target.value
            }
        });
    };

    render() {
        const { products, allKinds, user,  loginRequest, productsRequest, router, isLogin } = this.props;
        const { selectStyle, isMobile } = this.state;

        if(loginRequest){
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
            router.push('/');
        }

        return (
            <React.Fragment>
                <div className="products">
                    <div className="feather-shadow p--20">
                        <div className="products-title d-flex justify-content-between align-items-start">
                            <h1>Ваши товары:</h1>
                            <Link href="products/add">
                                <a className="btn btn-main">
                                    <h3>{!isMobile ? 'Добавить' : '+'}</h3>
                                </a>
                            </Link>
                        </div>
                        <div className="products-filter-and-result">
                            <h2 className="products-result">
                                {
                                    products.length > 0 ?
                                        `Всего: ${products.length}`
                                        : 'Вы пока не добавили ни одного товара'
                                }
                            </h2>
                            <Form onSubmit={this.onSubmit} className="d-flex flex-column flex-md-row justify-content-end w-75">
                                <div className="dashboard-search-container">
                                    <Form.Control
                                        className="dashboard-search feather-shadow"
                                        placeholder="Поиск..."
                                        onChange={this.setSearch}
                                        ref={this.searchInput}
                                    />
                                    <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={this.onSubmit}/>
                                </div>
                                <div className="select-wrap" ref={this.select}>
                                    <Form.Control as="select" value={router.query.kindId | null} onChange={this.onChangeKinds} style={selectStyle}>
                                        <option value="all">Все</option>
                                        {
                                            !allKinds ?
                                                <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                                : null
                                        }
                                        {
                                            allKinds.map( (item) => <option key={item.title_eng} value={item.id}>{item.title_rus}</option> )
                                        }
                                    </Form.Control>
                                </div>
                            </Form>
                        </div>
                    </div>

                    <div className="products-container position-relative d-flex flex-column mt--10">
                        {
                            productsRequest && products.length === 0 ?
                                <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                : null

                        }

                        {
                            productsRequest && products.length > 0 ?
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }

                        {
                            products.map( (product, idx) => <ShopProductsItem key={`product-${name}-${idx}`} {...product} idx={idx}/>)
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapMethodsToProps = ({getShopProducts}) => ({
    getShopProducts
});

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, shop: {products, productsRequest}, kinds: {all: allKinds}, router: {location: {search, pathname}}}) => ({
    isLogin,
    loginRequest,
    user,
    products,
    productsRequest,
    allKinds,
    search,
    pathname
});

export default connect(mapStateToProps, {setShopProducts, setShopProductsRequest, clearShopProducts})(withRouter(withGetData(ShopProducts, mapMethodsToProps)));
