import React, {Component} from "react";
import {Col, Container, Form, Pagination, Row} from "react-bootstrap";
import {DataService} from "../../services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {withRouter} from "next/router";
import {connect} from "react-redux";
const qs = require('qs');

class ShopsPage extends Component {

    state = {
        search: {
            q: ''
        },
        request: false,
        pagination: []
    };

    componentDidMount() {
        this.setState({request: false});
        this.updatePagination();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.shops !== this.props.shops || prevProps.router.query !== this.props.router.query) {
            this.setState({request: false});
            this.updatePagination();
        }
    }

    searchInput = React.createRef();

    updatePagination = () => {
        const {shops: {current_page, last_page}, router, pathname, search} = this.props;
        const query = qs.parse(search.replace("?", ""));
        const arr = [];
        arr.push((
            <React.Fragment key="next">
                <Pagination.First
                    onClick={
                        () => {
                            delete query.page;
                            this.changeRequest();
                            router.push(router.pathname, pathname + '?' + qs.stringify(query))
                        }
                    }
                />
                <Pagination.Prev
                    onClick={
                        () => {
                            if (current_page !== 1) {
                                query.page = current_page - 1;
                                this.changeRequest();
                                router.push(router.pathname, pathname + '?' + qs.stringify(query))
                            }
                        }
                    }
                />
            </React.Fragment>
        ));

        if ((current_page + 1) === last_page) {
            arr.push((
                <Pagination.Item key={current_page - 1}
                                 active={current_page === current_page - 1}
                                 onClick={
                                     () => {
                                         query.page = current_page - 1;
                                         this.changeRequest();
                                         router.push(router.pathname, pathname + '?' + qs.stringify(query))
                                     }
                                 }
                >{current_page - 1}</Pagination.Item>
            ))
        }

        if (current_page === last_page) {
            let arrRePosition = [];
            for(let i = current_page; i >= (current_page - 2); i--) {
                arrRePosition = [(
                    <Pagination.Item key={i}
                                     active={current_page === i}
                                     onClick={
                                         () => {
                                             query.page = i;
                                             this.changeRequest();
                                             router.push(router.pathname, pathname + '?' + qs.stringify(query))
                                         }
                                     }
                    >{i}</Pagination.Item>
                ), ...arrRePosition]
            }
            arr.push(arrRePosition)
        } else {
            for(let i = current_page; i <= (current_page + 2) && i <= last_page; i++) {
                arr.push((
                    <Pagination.Item key={i}
                                     active={current_page === i}
                                     onClick={
                                         () => {
                                             query.page = i;
                                             this.changeRequest();
                                             router.push(router.pathname, pathname + '?' + qs.stringify(query))
                                         }
                                     }
                    >{i}</Pagination.Item>
                ))
            }
        }

        if ((current_page + 2) < last_page) {
            arr.push((
                <React.Fragment key="elepsis">
                    <Pagination.Ellipsis />
                    <Pagination.Item>{last_page}</Pagination.Item>
                </React.Fragment>
            ))
        }

        arr.push((
            <React.Fragment key="prev">
                <Pagination.Next
                    onClick={
                        () => {
                            if (current_page < last_page) {
                                query.page = current_page + 1;
                                this.changeRequest();
                                router.push(router.pathname, pathname + '?' + qs.stringify(query))
                            }
                        }
                    }
                />
                <Pagination.Last
                    onClick={
                        () => {
                            query.page = last_page;
                            this.changeRequest();
                            router.push(router.pathname, pathname + '?' + qs.stringify(query))
                        }
                    }
                />
            </React.Fragment>
        ));

        this.setState({pagination: arr})
    };

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
                                        <Link href="/shops/[shopName]" as={`/shops/reptomix`}>
                                            <a className="item-img">
                                                <img src={item.logo_img_url ? item.logo_img_url : '/images/icons/error-snake.svg'} alt={item.company_name} className="img-fluid"/>
                                            </a>
                                        </Link>
                                        <div className="item-info">
                                            <Link href="/shops/[shopName]" as={`/shops/reptomix`}>
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
                    shops.current_page !== shops.last_page && shops.current_page !== 1 ?
                        <Pagination className="mb-2 justify-content-center">
                            {
                                pagination.map((item) => item)
                            }
                        </Pagination>
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