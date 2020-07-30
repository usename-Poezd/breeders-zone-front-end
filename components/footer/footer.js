import React from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faVk} from "@fortawesome/free-brands-svg-icons";

const Footer = (props) => {
    const {auth} = props;

    return (
        <div className="footer">
            <div className="footer-body">
                <div className="d-flex flex-wrap justify-content-center">
                    <Link href="/faq">
                        <a className="footer-item">FAQ</a>
                    </Link>
                    <Link href="/documents">
                        <a className="footer-item">Юридические документы</a>
                    </Link>
                    {
                        !auth.isLogin ?
                            <React.Fragment>
                                <Link href="/login">
                                    <a className="footer-item">Войти</a>
                                </Link>
                                <Link href="/register">
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
