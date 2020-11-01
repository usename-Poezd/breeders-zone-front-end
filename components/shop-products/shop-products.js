import React, {Component, useEffect, useState} from "react";
import ShopProductsItem from "../shop-products-item";
import Link from "next/link";
import {withRouter} from "next/router";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import withGetData from "../hoc-helpers/with-get-data";
import {connect} from "react-redux";
import {clearShopProducts, setShopProducts, setShopProductsRequest} from "../../actions";
import Spinner from "../spinner";
import qs from 'qs';

const ShopProducts = (props) => {

    const [q, setQuery] = useState('');
    const [kind, setKind] = useState(router.query.kindId | 'all');

    const onChangeKinds = (e) => {
        const {router, setShopProductsRequest, pathname} = props;
        const newQuery = router.query;
        setKind(e.target.value);
        if (e.target.value !== 'all') {
            delete newQuery.q;
            newQuery.kindId = e.target.value;
            setShopProductsRequest();
            router.push(router.pathname, pathname + '?' + qs.stringify(newQuery));
        }

        if (e.target.value === 'all' && router.query.kindId !== null) {
            delete newQuery.q;
            delete  newQuery.kindId;
            setShopProductsRequest();
            // Нужно чтобы страница не перегружалась
            router.push(router.pathname, pathname + '?' + qs.stringify(newQuery));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const {router, search: routerSearch} = props;
        const query = qs.parse(routerSearch.replace('?', ''));
        query.q = q;

        router.push(router.pathname + '?' + qs.stringify(query));
    };


    const setSearch = (e) => {
        setQuery(e.target.value);
    };

    const { products, allKinds, user,  loginRequest, productsRequest, router, isLogin, isMobile } = props;

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
                    <Form onSubmit={onSubmit} className="d-flex flex-column flex-md-row justify-content-end w-75">
                        <div className="dashboard-search-container">
                            <Form.Control
                                className="dashboard-search feather-shadow"
                                placeholder="Поиск..."
                                value={q}
                                onChange={setSearch}
                            />
                            <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={onSubmit}/>
                        </div>
                        <div className="select-wrap">
                            <Form.Control as="select" value={kind} onChange={onChangeKinds}>
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
                    products.map( (product, idx) => <ShopProductsItem key={`product-${product.name}-${idx}`} {...product} idx={idx}/>)
                }
            </div>
        </div>
    );
};

const mapMethodsToProps = ({getShopProducts}) => ({
    getShopProducts
});

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, shop: {products, productsRequest}, kinds: {all: allKinds}, router: {location: {search, pathname}}, stats: {isMobile}}) => ({
    isLogin,
    loginRequest,
    user,
    products,
    productsRequest,
    allKinds,
    search,
    pathname,
    isMobile
});

export default connect(mapStateToProps, {setShopProducts, setShopProductsRequest, clearShopProducts})(withRouter(withGetData(ShopProducts, mapMethodsToProps)));
