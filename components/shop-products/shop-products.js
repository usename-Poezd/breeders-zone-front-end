import React, {useState} from "react";
import ShopProductsItem from "../shop-products-item";
import Link from "next/link";
import {withRouter} from "next/router";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {withDataService} from "../../HOC";
import {connect} from "react-redux";
import {clearShopProducts, setShopProducts, setShopProductsRequest} from "../../redux/actions";
import Spinner from "../spinner";
import qs from 'qs';
import {checkMobile} from "../../utils";
import {Filter} from "../Filter";
import Pagination from "../Pagination";

const ShopProducts = (props) => {

    const { products, allKinds, user,  loginRequest, productsRequest, router, isLogin } = props;

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

    return (
        <div className="products">
            <div className="feather-shadow p--20">
                <div className="products-title d-flex justify-content-between align-items-start">
                    <h1>Ваши товары:</h1>
                    <Link href="products/add">
                        <a className="btn btn-main">
                            <h3>{!checkMobile() ? 'Добавить' : '+'}</h3>
                        </a>
                    </Link>
                </div>
                <div className="products-filter-and-result">
                    <h2 className="products-result">
                        {
                            products.meta?.total > 0 ?
                                `Всего: ${products.meta.total}`
                                : 'Вы пока не добавили ни одного товара'
                        }
                    </h2>
                    <Form onSubmit={onSubmit} className="d-flex flex-column flex-md-row justify-content-end w-75">
                        <div className="dashboard-search-container">
                            <Form.Control
                                className="dashboard-reducer feather-shadow"
                                placeholder="Поиск..."
                                value={q}
                                onChange={setSearch}
                            />
                            <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={onSubmit}/>
                        </div>
                        <Filter
                            id="kind"
                            name="kind"
                            className="w--30"
                            options={allKinds.map((item) => ({label: item.title_rus, value: item.id}))}
                        />
                    </Form>
                </div>
            </div>

            <div className="products-container position-relative d-flex flex-column mt--10">
                {
                    productsRequest && products.data.length === 0 ?
                        <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                        : null

                }

                {
                    productsRequest && products.data.length > 0 ?
                        <div className="load">
                            <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                        </div>
                        : null

                }

                {
                    products.data.map( (product, idx) => <ShopProductsItem key={`product-${product.name}-${idx}`} {...product} idx={idx}/>)
                }

                {
                    products.meta && products.meta.last_page !== 1 ?
                        <Pagination className="d-flex justify-content-center mb-2" totalItems={products.meta.last_page} pageSize={1} defaultActivePage={products.meta.current_page} changeRequest={() => {}}/>
                        : null
                }
            </div>
        </div>
    );
};

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

export default connect(mapStateToProps, {setShopProducts, setShopProductsRequest, clearShopProducts})(withRouter(withDataService(ShopProducts, mapMethodsToProps)));
