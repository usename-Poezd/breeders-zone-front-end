 import React, { Component } from 'react';
import ListItem from '../list-item';
import {Col, Modal, Row, Spinner as BootstrapSpinner} from 'react-bootstrap';
import { withGetData } from '../hoc-helpers';
import Chat from "../chat";
import Spinner from "../spinner";
import TopFilterAndResult from "../top-filter-and-result";
import {withRouter} from "next/router";
import {connect} from "react-redux";
 import Head from "next/head";
const qs = require('qs');

class TraitItems extends Component {
    state = {
        sendMessageModal: false,
        modalUser: null,
        request: false,
    };

    componentDidMount() {
        this.setState({request: false});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product || prevProps.router.query !== this.props.router.query)
            this.setState({request: false});
    }

    changeRequest = () => this.setState({request: true});


    sendMessage = (user) => {
        const { router, pathname, search } = this.props;

        this.setState({
            sendMessageModal: true,
            modalUser: user
        });
        router.push(router.pathname, pathname + (search ? search + '&act=new' : '?act=new'));
    };

    modalClose = () => {
        const { router, pathname, search } = this.props;
        const newQuery = qs.parse(search.replace('?', ''));
        if (newQuery.act)
            delete newQuery.act;
        if (newQuery.room)
            delete newQuery.room;
        router.push(router.pathname, pathname + (qs.stringify(newQuery) ? '?' + qs.stringify(newQuery) : ''));
        this.setState({sendMessageModal: false});
    };

    render() {
        const { sendMessageModal, modalUser, request } = this.state;
        const {products: {data: items, total}, selectedMorphs, localities} = this.props;

        if (request && items.length === 0) {
            return <Spinner/>;
        }

        return (
            <React.Fragment>
                <Head>
                    <title>
                        Животные с морофой
                        {
                            selectedMorphs.map( ({geneTitle, traitTitle, type}) => ` ${traitTitle} ${geneTitle}`)
                        }
                    </title>
                </Head>
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
                            <ListItem key={item.id} {...item} sendMessage={this.sendMessage}/>
                        ))
                    }
                </Row>
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

export default connect(mapStateToProps)(
    withRouter(withGetData(TraitItems, mapMethodsToProps))
);
