import * as React from "react";
import {FC, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {Form} from "react-bootstrap";
import {connect} from "react-redux";
import {clearShopProducts, setShopProductsRequest} from "../../../redux/Shop";
import qs from 'qs';
import {checkMobile} from "../../../utils";
import {Filter, IOption} from "../../../components/Filter";
import Pagination from "../../../components/Pagination";
import {IRootState} from "../../../redux/store";
import {IShopProductsStateProps, ShopProductsPropsType} from "./types";
import {ShopProductSkeleton} from "./components/ShopProductSkeleton";
import {ShopProductsItem} from "./components/ShopProductsItem";

const ShopProductsComponent: FC<ShopProductsPropsType> = (props) => {

    const { products, allKinds, user,  loginRequest, isLogin, productsRequest, setShopProductsRequest } = props;

    const [q, setQuery] = useState('');
    const router = useRouter();

    const onSubmit = (e) => {
        e.preventDefault();
        const {search: routerSearch} = props;
        const query = qs.parse(routerSearch.replace('?', ''));
        query.q = q;
        setShopProductsRequest(true);

        router.push(router.pathname + '?' + qs.stringify(query));
    };

    if (!loginRequest && (!isLogin && user?.is_breeder)) {
        router.push("/")
    }

    return (
        <div className="products">
            <div className="feather-shadow p--20">
                <div className="products-title d-flex justify-content-between align-items-start">
                    <h1>Ваши товары:</h1>
                    <Link href="/products/add">
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
                                onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={onSubmit}/>
                        </div>
                        <Filter
                            id="kind"
                            name="kind"
                            className="w--30"
                            onFilter={() => setShopProductsRequest(true)}
                            options={[
                                {
                                    label: 'Все',
                                    value: ''
                                },
                                ...allKinds.map((item): IOption => ({label: item.title_rus, value: item.id})),
                            ]}
                        />
                    </Form>
                </div>
            </div>

            <div className="products-container position-relative d-flex flex-column mt--10">
                {
                    productsRequest  &&
                        <React.Fragment>
                            <ShopProductSkeleton/>
                            <ShopProductSkeleton/>
                            <ShopProductSkeleton/>
                        </React.Fragment>
                }

                {
                    !productsRequest && products.data.map( (product, idx) => <ShopProductsItem key={`product-${product.name}-${idx}`} {...product}/>)
                }

                {
                    !productsRequest && products.meta && products.meta.last_page !== 1 ?
                        <Pagination
                            className="d-flex justify-content-center mb-2"
                            totalItems={products.meta.last_page}
                            pageSize={1}
                            defaultActivePage={products.meta.current_page}
                            changeRequest={() => setShopProductsRequest(true)}
                        />
                        : null
                }
            </div>
        </div>
    );
};

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, shop: {products, productsRequest}, kinds: {all: allKinds}, router: {location: {search}}}: IRootState): IShopProductsStateProps => ({
    isLogin,
    loginRequest,
    user,
    products,
    productsRequest,
    allKinds,
    search
});

const ShopProducts =  connect(mapStateToProps, {setShopProductsRequest, clearShopProducts})(ShopProductsComponent);

export {
    ShopProducts
}
