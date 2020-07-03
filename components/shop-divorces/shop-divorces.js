import React, {Component} from "react";
import {connect} from "react-redux";
import {withGetData} from "../hoc-helpers";
import {
    clearShopDivorces,
    setShopDivorces,
    setShopDivorcesRequest
} from "../../actions";
import Spinner from "../spinner";
import {Pipes} from "../../services";
import ShopDivorcesItem from "../shop-divorces-item";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {withRouter} from "next/router";
import Link from "next/link";

class ShopDivorces extends Component{

    pipes = new Pipes();

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
        this.updateDivorces();
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

    updateDivorces = () => {
        const {getDivorces, setShopDivorcesRequest, setShopDivorces} = this.props;
        const {options} = this.state;

        setShopDivorcesRequest();
        getDivorces({...options, onlyBreeder: true})
            .then((data) => setShopDivorces(data.data))
    };

    onChangeKinds = (e) => {
        if (e.target.value !== 'all') {
            this.setState({
                options: {
                    kindId: Number(e.target.value)
                }
            }, () => this.updateDivorces());
        }

        if (e.target.value === 'all' && this.state.options.kindId !== null) {
            this.setState({
                options: {
                    kindId: null
                }
            }, () => this.updateDivorces());
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
                <div className="products feather-shadow">
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
                                divorces.length > 0 ?
                                    `Всего: ${divorces.length}`
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

                    <div className="divorces products-container position-relative d-flex flex-column">
                        {
                            divorcesRequest && divorces.length === 0 ?
                                <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                : null

                        }

                        {
                            divorcesRequest && divorces.length > 0 ?
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                                : null

                        }

                        {
                            divorces.map( (item) => <ShopDivorcesItem hasControls key={`divorce-${item.id}`} {...item}/>)
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapMethodsToProps = ({getDivorces}) => ({
    getDivorces
});

const mapStateToProps = ({shop: {divorces, divorcesRequest}, kinds: { all: allKinds}, profile: {user}}) => ({
    divorces,
    divorcesRequest,
    allKinds,
    user
});

export default connect(mapStateToProps, { setShopDivorcesRequest, setShopDivorces, clearShopDivorces })(
    withRouter(
        withGetData(ShopDivorces, mapMethodsToProps)
    )
);
