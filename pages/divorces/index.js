import React, {Component} from "react";
import {DataService} from "../../services";
import {Col, Container, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import Pagination from "../../components/Pagination";
import {withRouter} from "next/router";
import Spinner from "../../components/spinner";
import DivorcesListItem from "../../components/divorces-list-item";
import ReportModal from "../../components/report-modal/report-modal";
import Head from "next/head";

class Divorces extends Component {
    state = {
        request: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.router.query !== this.props.router.query) {
            this.setState({request: false})
        }
    }

    changeRequest = () => this.setState({request: true});

    render() {
        const {divorces} = this.props;
        const {request} = this.state;

        return (
            <Container>
                <Head>
                    <title>Все разводы | Breeders Zone</title>
                    <meta name="description" content="История разведений | Breeders Zone"/>
                </Head>
                <ReportModal/>
                <Row>
                    <Col xs={12} className="my-3">
                        <h1>Разводы:</h1>
                    </Col>
                </Row>
                <Row className="position-relative">
                    {
                        request && divorces.data.length > 0 ?
                            <div className="load">
                                <BootstrapSpinner animation="border" className="m-auto"/>
                            </div>
                            : null
                    }
                    {
                        request && divorces.data.length === 0 ?
                            <Spinner/>
                            : null
                    }
                    {
                        divorces.data.map( (item) => <DivorcesListItem key={item.id} {...item}/>)
                    }
                </Row>
                {
                    divorces.last_page !== 1 ?
                        <Pagination className="d-flex justify-content-center mb-2" totalItems={divorces.last_page} pageSize={1} defaultActivePage={divorces.current_page} changeRequest={this.changeRequest}/>
                        : null
                }
            </Container>
        );
    }
};

export const getServerSideProps = async (ctx) => {
    const dataService = new DataService();
    const divorces = await dataService.getDivorces(ctx.query);
    return {
        props: {
            divorces
        }
    }
};

export default withRouter(Divorces);
