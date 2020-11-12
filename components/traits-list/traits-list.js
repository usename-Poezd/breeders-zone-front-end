 import React, { Component } from 'react';
import TraitItem from '../trait-item';
import {Col, Modal, Row, Spinner as BootstrapSpinner} from 'react-bootstrap';
import { withDataService } from '../../HOC';
import Chat from "../chat";
import Spinner from "../spinner";
import TopFilterAndResult from "../top-filter-and-result";
import {withRouter} from "next/router";
import {connect} from "react-redux";
 import Head from "next/head";
 import Link from "next/link";
 import ReportModal from "../report-modal/report-modal";
 import Pagination from "../../components/pagination";
 import {setChatAct} from "../../redux/Chat";
const qs = require('qs');

class TraitsList extends Component {
    state = {
        sendMessageModal: false,
        modalUser: null,
        request: false,
        pagination: []
    };

    componentDidMount() {
        this.setState({request: false});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product || prevProps.router.query !== this.props.router.query) {
            this.setState({request: false});
        }
    }

    changeRequest = () => this.setState({request: true});


    sendMessage = (user) => {
        const {setChatAct} = this.props;
        setChatAct('new');
        this.setState({
            sendMessageModal: true,
            modalUser: user
        });
    };

    modalClose = () => {
        const { router, pathname, search } = this.props;
        const newQuery = qs.parse(search.replace('?', ''));
        if (newQuery.act) {
            delete newQuery.act;
        }
        if (newQuery.room) {
            delete newQuery.room
        }

        router.push(router.pathname, pathname + '?' + qs.stringify(newQuery), { shallow: true });
        this.setState({sendMessageModal: false});
    };

    render() {
        const { sendMessageModal, modalUser, request } = this.state;
        const {products: {data: items, total, current_page, last_page}, selectedMorphs, localities} = this.props;


        if (request && items.length === 0) {
            return <Spinner/>;
        }

        return (
            <React.Fragment>
                <ReportModal/>
                <TopFilterAndResult total={total} morphs={selectedMorphs} localities={localities} changeRequest={this.changeRequest}/>
                <Row className="position-relative">
                    <Modal show={sendMessageModal} onHide={this.modalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Сообщения</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Chat newUser={modalUser}/>
                        </Modal.Body>
                    </Modal>
                    {
                        request && items.length > 0 ?
                            (
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                            )
                            : null
                    }
                    {
                        items.map( (item) => (
                            <TraitItem key={item.id} {...item} sendMessage={this.sendMessage}/>
                        ))
                    }
                </Row>
                {
                    last_page !== 1 ?
                        <Pagination className="d-flex justify-content-center mb-2" totalItems={last_page} pageSize={1} defaultActivePage={current_page} changeRequest={this.changeRequest}/>
                        : null
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({router: {location: {pathname, search}}}) => ({
    pathname,
    search
});

const mapMethodsToProps = ({getProducts}) => ({
    getProducts
});

export default connect(mapStateToProps, {setChatAct})(
    withRouter(withDataService(TraitsList, mapMethodsToProps))
);
