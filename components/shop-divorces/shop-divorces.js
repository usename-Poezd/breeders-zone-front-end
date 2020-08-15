import React, {Component} from "react";
import {connect} from "react-redux";
import {withGetData} from "../hoc-helpers";
import {
    clearShopDivorces,
    setShopDivorcesRequest
} from "../../actions";
import Spinner from "../spinner";
import {Pipes} from "../../services";
import ShopDivorcesItem from "../shop-divorces-item";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {withRouter} from "next/router";
import Link from "next/link";
import Pagination from "../pagination";
import qs from "qs";

class ShopDivorces extends Component{

    pipes = new Pipes();

    select = React.createRef();

    state = {
        isMobile: false,
        selectStyle: {
            width: '150px'
        }
    };

    componentDidMount() {
        if (window.innerWidth <= 576) {
            this.setState({isMobile: true})
        }
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        const { clearShopDivorces } = this.props;
        window.removeEventListener('resize', this.onResize);
        clearShopDivorces();
    }

    onResize = () => {
        const { isMobile } = this.state;
        if (window.innerWidth <= 576) {
            return this.setState({isMobile: true})
        }

        if (isMobile) {
            this.setState({isMobile: false})
        }
    };

    onChangeSort = (e) => {
        const {router, setShopDivorcesRequest} = this.props;
        const newQuery = router.query;

        newQuery.sort = e.target.value;
        setShopDivorcesRequest();
        router.push(router.pathname + '?' + qs.stringify(newQuery))
    };

    onChangeKinds = (e) => {
        const {router, setShopDivorcesRequest} = this.props;
        const newQuery = router.query;
        if (e.target.value !== 'all') {
            delete newQuery.page;
            newQuery.kindId = e.target.value;
            setShopDivorcesRequest();
            router.push(router.pathname + '?' + qs.stringify(newQuery))
        }

        if (e.target.value === 'all' && router.query.kindId !== null) {
            delete newQuery.page;
            delete newQuery.kindId;
            setShopDivorcesRequest();
            router.push(router.pathname + '?' + qs.stringify(newQuery))
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

    changeRequest = () => {
        const {setShopDivorcesRequest}  = this.props;
        setShopDivorcesRequest();
    };

    render() {
        const { selectStyle, isMobile } = this.state;
        const { divorces, divorcesRequest, allKinds, user, router, isLogin } = this.props;

        if (allKinds.length === 0) {
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={9} className="mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            );
        }

        if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
            router.push('/');
        }

        return (
            <React.Fragment>
                {/*<BreadCrumbs/>*/}
                <div className="products">
                    <div className="feather-shadow p--20">
                        <div className="products-title d-flex justify-content-between align-items-start">
                            <h1>Ваши разводы:</h1>
                            <Link href="/profile/divorces/add">
                                <a className="btn btn-main">
                                    <h3>{!isMobile ? 'Добавить' : '+'}</h3>
                                </a>
                            </Link>
                        </div>
                        <div className="products-filter-and-result">
                            <h2 className="products-result">
                                {
                                    divorces.total > 0 ?
                                        `Всего: ${divorces.total}`
                                        : 'Вы пока не добавили ни одного товара'
                                }
                            </h2>
                            <Form className="d-flex justify-content-end">
                                <div className="select-wrap mr--10" ref={this.select}>
                                    <Form.Control as="select" value={router.query.sort} onChange={this.onChangeSort} style={selectStyle}>
                                        <option value="desc">Сначала новые</option>
                                        <option value="asc">Сначала старые</option>
                                    </Form.Control>
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

                    <div className="divorces products-container position-relative d-flex flex-column mt--10">
                        {
                            divorcesRequest && divorces.data.length === 0 ?
                                <div className="products-item feather-shadow d-flex justify-content-center">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }

                        {
                            divorcesRequest && divorces.data.length > 0 ?
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }

                        {
                            divorces.data.map( (item) => <ShopDivorcesItem hasControls key={`divorce-${item.id}`} {...item}/>)
                        }
                    </div>
                    {
                        divorces.last_page !== 1 ?
                            <div className="d-flex align-items-center justify-content-center feather-shadow p--10">
                                <Pagination
                                    className="d-flex justify-content-center mt--0"
                                    totalItems={divorces.last_page}
                                    pageSize={1}
                                    defaultActivePage={divorces.current_page}
                                    changeRequest={this.changeRequest}
                                />
                            </div>
                            : null
                    }
                </div>
            </React.Fragment>
        );
    }

}

const mapMethodsToProps = ({getDivorces}) => ({
    getDivorces
});

const mapStateToProps = ({auth: {isLogin}, shop: {divorces, divorcesRequest}, kinds: { all: allKinds}, profile: {user}}) => ({
    divorces,
    divorcesRequest,
    allKinds,
    user,
    isLogin
});

export default connect(mapStateToProps, { setShopDivorcesRequest, clearShopDivorces })(
    withRouter(
        withGetData(ShopDivorces, mapMethodsToProps)
    )
);
