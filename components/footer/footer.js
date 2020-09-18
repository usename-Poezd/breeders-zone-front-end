import React, {useState} from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faVk} from "@fortawesome/free-brands-svg-icons";
import {Modal} from "react-bootstrap";

const Footer = (props) => {
    const {auth} = props;

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
                    <a href="https://fb.com" className="footer-item">
                        <FontAwesomeIcon icon={faFacebook} className="social-facebook" size="lg"/>
                    </a>
                    <a href="https://vk.com" className="footer-item">
                        <FontAwesomeIcon icon={faVk} className="social-vk" size="lg"/>
                    </a>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = ({auth}) => ({
    auth
});

export default connect(mapStateToProps)(Footer);
