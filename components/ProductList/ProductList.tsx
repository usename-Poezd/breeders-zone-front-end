import * as React from "react";
import {FC, useEffect, useState} from "react";
import {Modal, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import Chat from "../chat";
import Pagination from "../pagination";
import {setChatAct} from "../../redux/Chat";
import {IRootState} from "../../redux/store";
import {IProductListStateProps, ProductListProps} from "./types";
import {connect} from "react-redux";
import Spinner from "../spinner";
import {IShop, IUser} from "../../types";
import {useRouter} from "next/router";
import {ProductListItem} from "./components/ProductListItem";
import {FilterResult} from "./components/FilterResult";
const qs = require('qs');

const ProductListComponent: FC<ProductListProps> = (props) => {
    const {
        products,
        meta,
        isFilter = true,
        hasRow = true
    } = props;
    const [isModal, setModal] = useState<boolean>(false);
    const [modalUser, setModalUser] = useState<IShop|IUser|null>(null);
    const [request, setRequest] = useState<boolean>(false);
    const { pathname, search } = props;
    const router = useRouter();

    useEffect(() => {
        setRequest(false);
    }, [products]);

    const changeRequest = () => setRequest(true);


    const sendMessage = (user: IShop|IUser) => {
        const {setChatAct} = props;
        setChatAct('new');
        setModal(true);
        setModalUser(user);
    };

    const modalClose = () => {

        const newQuery = qs.parse(search.replace('?', ''));
        if (newQuery.act) {
            delete newQuery.act;
        }
        if (newQuery.room) {
            delete newQuery.room
        }

        router.push(router.pathname, pathname + '?' + qs.stringify(newQuery), { shallow: true });
        setModal(false);
    };


    if (request && products.length === 0) {
        return <Spinner/>;
    }

    return (
        <React.Fragment>
            {/*<ReportModal/>*/}
            {
                isFilter && meta &&
                    <FilterResult total={meta.total} morphs={meta.selected_morphs} localities={meta.selected_localities} changeRequest={changeRequest}/>
            }
            {
                hasRow ?
                    <Row className="position-relative">
                        <Modal show={isModal} onHide={modalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Сообщения</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Chat newUser={modalUser}/>
                            </Modal.Body>
                        </Modal>
                        {
                            request && products.length > 0 &&
                            <div className="load">
                                <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                            </div>
                        }
                        {
                            products.map( (item) => (
                                <ProductListItem key={item.id} {...item} sendMessage={sendMessage}/>
                            ))
                        }
                    </Row>
                    : (
                        <React.Fragment>
                            <Modal show={isModal} onHide={modalClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Сообщения</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Chat newUser={modalUser}/>
                                </Modal.Body>
                            </Modal>
                            {
                                request && products.length > 0 &&
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                            }
                            {
                                products.map( (item) => (
                                    <ProductListItem key={item.id} {...item} sendMessage={sendMessage}/>
                                ))
                            }
                        </React.Fragment>
                    )
            }
            {
                meta && meta.last_page !== 1 ?
                    <Pagination className="d-flex justify-content-center mb-2" totalItems={meta.last_page} pageSize={1} defaultActivePage={meta.current_page} changeRequest={changeRequest}/>
                    : null
            }
        </React.Fragment>
    );
};

const mapStateToProps = ({router: {location: {pathname, search}}}: IRootState): IProductListStateProps => ({
    pathname,
    search
});

const ProductList =  connect(mapStateToProps, {setChatAct})(ProductListComponent);
export  {
    ProductList
}
