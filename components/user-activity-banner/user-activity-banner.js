import React, {Component, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Container} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faTimes} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import nookies from "nookies";


class UserActivityBanner extends Component {

    state = {
        isOpen: false,
        success: false,
    };

    componentDidMount() {
        const {success} = this.state;
        const {loginRequest, user, isLogin} = this.props;
        if (!loginRequest && isLogin && !success && user.is_breeder && !user.active && !nookies.get().isActivityChecked ) {
            setTimeout(() => this.setState({isOpen: true}), 3000);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user !== this.props.user || prevProps.loginRequest !== this.props.loginRequest) {
            const {success} = this.state;
            const {loginRequest, user, isLogin} = this.props;
            if (!loginRequest && isLogin && user.is_breeder && !user.active && !success && !nookies.get().isActivityChecked ) {
                setTimeout(() => this.setState({isOpen: true}), 3000);
            }
        }
    }

    render() {
        const {isOpen, success,} = this.state;
        const {user, isLogin} = this.props;

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
                    isOpen && isLogin && user.is_breeder && !user.active && !nookies.get().isActivityChecked ?
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
                                    <motion.span
                                        initial={{ opacity: 0}}
                                        animate={{ opacity: 1, transition: { duration: 0.7 } }}
                                        className="position-absolute"
                                        style={{top: 10, right: 10}}
                                        onClick={
                                            () => {
                                                this.setState({isOpen: false});
                                                nookies.set(null, 'isActivityChecked', true, {
                                                    expires: new Date('01 January 30 00:00:00 UTC')
                                                })
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faTimes} size="lg"/>
                                    </motion.span>
                                    <Container fluid>
                                        <p className="p-3">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2"/>
                                            Для улучшения качества, все магазины проходят контроль перед тем как выстовлять свои товары на Breeders Zone,
                                            пожалуйста заполните данные о магазине в <Link href="profile/shop"><a>профиле магазина</a></Link>
                                        </p>
                                    </Container>
                                </motion.div>
                            )
                        )
                        : null
                }
            </AnimatePresence>
        );
    }
}

const mapStateToProps = ({auth: {loginRequest, isLogin}, profile: {user}}) => ({
    loginRequest,
    isLogin,
    user
});

export default connect(mapStateToProps)(UserActivityBanner);
