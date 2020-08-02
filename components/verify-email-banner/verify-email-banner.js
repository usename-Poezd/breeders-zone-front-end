import React, {Component, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Container} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {withGetData} from "../hoc-helpers";
import {withRouter} from "next/router";

class VerifyEmailBanner extends Component{

    state = {
        isOpen: false,
        success: false
    };

    componentDidMount() {
        const {success} = this.state;
        const {loginRequest, user, isLogin, router} = this.props;
        if (!loginRequest && isLogin && !user.email_verified_at && !success && router.pathname !== '/verify/[verificationCode]' ) {
            setTimeout(() => this.setState({isOpen: true}), 3000);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user !== this.props.user || prevProps.loginRequest !== this.props.loginRequest) {
            const {success} = this.state;
            const {loginRequest, user, isLogin, router} = this.props;
            if (!loginRequest && isLogin && !user.email_verified_at && !success && router.pathname !== '/verify/[verificationCode]' ) {
                setTimeout(() => this.setState({isOpen: true}), 3000);
            }
        }
    }

    render() {
        const {isOpen, success} = this.state;
        const {sendVerifyEmail, user, isLogin} = this.props;

        const variants = {
            success: {
                height: '100%',
                background: '#3ED04D',
                transition: {
                    duration: 0.5
                }
            },
            warning: {
                height: '100%',
                background: '#f8d568',
                transition: {
                    duration: 0.5
                }
            }
        };

        return (
            <AnimatePresence>
                {
                    isOpen && isLogin && !user.email_verified_at ?
                        (
                            (
                                <motion.div
                                    positionTransition
                                    initial={{ height: 0}}
                                    animate={success ? 'success' : 'warning'}
                                    variants={variants}
                                    exit={{ height: 0, transition: { duration: 0.3 } }}
                                    className="verify-email position-relative"
                                >
                                    {
                                        !success ?
                                            (
                                                <motion.span
                                                    initial={{ opacity: 0}}
                                                    animate={{ opacity: 1, transition: { duration: 0.7 } }}
                                                    className="position-absolute"
                                                    style={{top: 10, right: 10}}
                                                    onClick={
                                                        () => {
                                                            this.setState({isOpen: false})
                                                        }
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faTimes} size="lg"/>
                                                </motion.span>
                                            ) : null
                                    }
                                    <Container fluid>
                                        <p className="p-3">
                                            {
                                                success ?
                                                    (
                                                        "Ваше письмо отправленно"
                                                    )
                                                    : (
                                                        <React.Fragment>
                                                            <FontAwesomeIcon icon={faExclamationTriangle}/>Пожалуйста подтвердите адресс элетронной почты, проверте ящик или кликните&nbsp;
                                                            <a
                                                                href="#"
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.setState({success: true});
                                                                        sendVerifyEmail();
                                                                        setTimeout(() => this.setState({isOpen: false}), 3000)
                                                                    }
                                                                }
                                                            >сюда</a>
                                                            &nbsp;чтобы отправить письмо
                                                        </React.Fragment>
                                                    )
                                            }
                                        </p>
                                    </Container>
                                </motion.div>
                            )
                        )
                        : null
                }
            </AnimatePresence>
        )
    }
}

const mapMethodsToProps = ({sendVerifyEmail}) => ({
    sendVerifyEmail,
});

const mapStateToProps = ({auth: {loginRequest, isLogin}, profile: {user}}) => ({
    loginRequest,
    user,
    isLogin
});

export default connect(mapStateToProps)(withGetData(withRouter(VerifyEmailBanner), mapMethodsToProps));
