import React, {useState} from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Modal} from "react-bootstrap";
import {ISocial} from "../../reducers/socials/types";

const Footer = (props) => {
    const {auth, socials} = props;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="footer">
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Помощь</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Возникли трудности? Пишите нам на почту:<br/>
                        <a href={"mailto:support@breederszone.com"}>support@breederszone.com</a>
                    </p>
                </Modal.Body>
            </Modal>

            <div className="footer-body">
                <div className="d-flex flex-wrap justify-content-center">
                    <Link href="/faq">
                        <a className="footer-item">FAQ</a>
                    </Link>
                    <Link href="/documents">
                        <a className="footer-item">Юридические документы</a>
                    </Link>
                    <p className="btn-link footer-item cursor-pointer" onClick={handleShow}>Помощь</p>
                    {
                        !auth.isLogin ?
                            <React.Fragment>
                                <Link href="/login">
                                    <a className="footer-item">Войти</a>
                                </Link>
                                <Link href="/registration">
                                    <a className="footer-item">Зарегистрироваться</a>
                                </Link>
                            </React.Fragment>
                            : null
                    }
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {
                        socials.all.map((item: ISocial) => (
                            <a href={item.url} target="_blank" className="footer-item">
                                <FontAwesomeIcon icon={["fab", item.fa_icon]} size="lg"/>
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ({auth, socials}) => ({
    auth,
    socials
});

export default connect(mapStateToProps)(Footer);
