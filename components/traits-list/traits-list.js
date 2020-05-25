 import React, { Component } from 'react';
import TraitItem from '../trait-item';
import {Col, Modal, Pagination, Row, Spinner as BootstrapSpinner} from 'react-bootstrap';
import { withGetData } from '../hoc-helpers';
import Chat from "../chat";
import Spinner from "../spinner";
import TopFilterAndResult from "../top-filter-and-result";
import {withRouter} from "next/router";
import {connect} from "react-redux";
 import Head from "next/head";
 import Link from "next/link";
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
        this.updatePagination();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product || prevProps.router.query !== this.props.router.query) {
            this.setState({request: false});
            this.updatePagination();
        }
    }

    updatePagination = () => {
        const {products: {current_page, last_page}, router, pathname, search} = this.props;
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

    changeRequest = () => this.setState({request: true});


    sendMessage = (user) => {
        const { router, pathname, search } = this.props;

        this.setState({
            sendMessageModal: true,
            modalUser: user
        });
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
        const { sendMessageModal, modalUser, request, pagination } = this.state;
        const {products: {data: items, total, current_page, last_page}, selectedMorphs, localities} = this.props;


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
                            <Chat newUser={modalUser} act='new'/>
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
                    current_page !== last_page && current_page !== 1 ?
                        <Pagination className="mb-2 justify-content-center">
                            {
                                pagination.map((item) => item)
                            }
                        </Pagination>
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

export default connect(mapStateToProps)(
    withRouter(withGetData(TraitsList, mapMethodsToProps))
);
