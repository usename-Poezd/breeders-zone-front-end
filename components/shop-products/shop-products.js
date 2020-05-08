import React, {Component} from "react";
import ShopProductsItem from "../shop-products-item";
import Link from "next/link";
import Router from "next/router";
import {Col, Dropdown, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import withGetData from "../hoc-helpers/with-get-data";
import {connect} from "react-redux";
import {clearShopProducts, setShopProducts, setShopProductsRequest} from "../../actions";
import Spinner from "../spinner";
import {isLogin} from "../../utils";

class ShopProducts extends Component {

    select = React.createRef();

    state = {
        isMobile: false,
        options: {
            kindId: null
        },
        selectStyle: {
            width: '150px'
        }
    };

    componentDidMount() {
        if (window.innerWidth <= 576) {
            this.setState({isMobile: true})
        }
        window.addEventListener('resize', this.onResize);
        this.updateProducts();
    }

    componentWillUnmount() {
        const { clearShopProducts } = this.props;
        window.removeEventListener('resize', this.onResize);
        clearShopProducts();
    }

    updateProducts = (options = {}) => {
        const { getShopProducts, setShopProducts, user, isLogin, setShopProductsRequest } = this.props;
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
        if (e.target.value !== 'all') {
            this.setState({
                options: {
                    kindId: Number(e.target.value)
                }
            }, () => this.updateProducts(this.state.options));
        }

        if (e.target.value === 'all' && this.state.options.kindId !== null) {
            this.setState({
                options: {
                    kindId: null
                }
            }, () => this.updateProducts(this.state.options));
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

    render() {
        const { products, allKinds, user,  loginRequest, productsRequest } = this.props;
        const { selectStyle, isMobile } = this.state;

        if(loginRequest && isMobile){
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className="mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        if(loginRequest){
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        if (!(user.is_breeder || isLogin()) && typeof window !== 'undefined'){
            Router.push('/');
        }

        return (
            <React.Fragment>
                <div className="products feather-shadow">
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
                        <Form className="justify-content-end">
                            <div className="select-wrap" ref={this.select}>
                                <Form.Control as="select" onChange={this.onChangeKinds} style={selectStyle}>
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

                    <div className="products-container position-relative d-flex flex-column">
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

const mapStateToProps = ({auth: {isLogin, loginRequest}, profile: {user}, shop: {products, productsRequest}, kinds: {all: allKinds}}) => ({
    isLogin,
    loginRequest,
    user,
    products,
    productsRequest,
    allKinds
});

export default connect(mapStateToProps, {setShopProducts, setShopProductsRequest, clearShopProducts})(withGetData(ShopProducts, mapMethodsToProps));
