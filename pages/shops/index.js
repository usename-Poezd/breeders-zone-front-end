import React, {Component} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import {DataService} from "../../services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {withRouter} from "next/router";
import {connect} from "react-redux";
import Pagination from "../../components/pagination";
const qs = require('qs');

class ShopsPage extends Component {

    state = {
        search: {
            q: ''
        },
        request: false
    };

    componentDidMount() {
        this.setState({request: false});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.shops !== this.props.shops || prevProps.router.query !== this.props.router.query) {
            this.setState({request: false});
        }
    }

    searchInput = React.createRef();

    onSubmit = (e) => {
        e.preventDefault();
        const {router, search: routerSearch} = this.props;
        const {search} = this.state;
        const query = qs.parse(routerSearch.replace('?', ''));
        query.q = search.q;

        router.push('/shops?' + qs.stringify(query));
        this.searchInput.current.value = '';
    };


    setSearch = (e) => {
        this.setState({
            search: {
                q: e.target.value
            }
        });
    };

    render() {
        const {pagination} = this.state;
        const {shops} = this.props;

        return (
            <Container>
                <Form onSubmit={this.onSubmit} className="dashboard-filter d-flex justify-content-center">
                    <div className="dashboard-search-container">
                        <Form.Control
                            className="dashboard-search feather-shadow"
                            placeholder="Поиск..."
                            onChange={this.setSearch}
                            ref={this.searchInput}
                        />
                        <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={this.onSubmit}/>
                    </div>
                </Form>
                <Row>
                    {
                        shops.data.map( (item) => (
                            <Col xs={12} sm={6} ms={4} lg={3} className="item">
                                <div className="list-item">
                                    <div className="item-body">
                                        <Link href="/shops/[shopName]" as={`/shops/${item.company_name}`}>
                                            <a className="item-img">
                                                <img src={item.logo_img_url ? item.logo_img_url : '/images/icons/error-snake.svg'} alt={item.company_name} className="img-fluid"/>
                                            </a>
                                        </Link>
                                        <div className="item-info">
                                            <Link href="/shops/[shopName]" as={`/shops/${item.company_name}`}>
                                                <a className="item-title text-center text-decoration-none mb-2">
                                                    <h3>{item.company_name}</h3>
                                                    <p>{item.owner} ({item.products_count})</p>
                                                </a>
                                            </Link>
                                            <div className="item-info-container d-flex justify-content-center align-items-center">
                                                <div className="cb-and-raiting">
                                                    <div className="delivery info d-flex">
                                                        {
                                                            item.local_delivery ?
                                                                (
                                                                    <div className="delivery-item mr-1">
                                                                        <FontAwesomeIcon icon={faCar} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {
                                                            item.regional_delivery ?
                                                                (
                                                                    <div className="delivery-item mr-1">
                                                                        <FontAwesomeIcon icon={faTruck} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {
                                                            item.countrywide_delivery ?
                                                                (
                                                                    <div className="delivery-item">
                                                                        <FontAwesomeIcon icon={faHelicopter} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                {
                    shops.last_page !== 1 ?
                        <Pagination className="d-flex justify-content-center mb-2" totalItems={shops.last_page} pageSize={1} defaultActivePage={shops.current_page} changeRequest={() => this.setState({request: true})}/>
                        : null
                }
            </Container>
        )
    }
}

const mapStateToProps = ({router: {location: {search, pathname}}}) => ({
    search,
    pathname
});

export const getServerSideProps = async (ctx) => {
    const  dataService = await new DataService();
    if (ctx.query.kind) {
        ctx.query.kind = await ctx.query.kind.replace('-', ' ');
    }
    const shops = await dataService.getShops(ctx.query);

    return {
        props: {
            shops
        }
    }
};

export default connect(mapStateToProps)(withRouter(ShopsPage));