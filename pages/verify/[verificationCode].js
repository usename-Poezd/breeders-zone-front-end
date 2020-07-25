import React, {useState} from "react";
import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import {withGetData} from "../../components/hoc-helpers";
import {motion} from "framer-motion";

const VerificationPage = ({verification, sendVerifyMail}) => {
    const [sendMail, setSendMail] = useState(false);
    const variants = {
        successMail: {
            height: '100%',
            background: '#3ED04D',
            transition: {
                duration: 0.5
            }
        },
        default: {
            height: '100%',
            background: '#fff',
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <Container>
            <Row style={{marginTop: 20}}>
                <Col xs={12}>
                    <motion.div
                        className="shop-container"
                        initial={false}
                        animate={sendMail ? "successMail" : "default"}
                        variants={variants}
                    >
                        {
                            !sendMail ?
                                (
                                    <React.Fragment>
                                        <h2 className={verification.success ? 'text-success' : 'text-danger'}>{verification.message}</h2>
                                        {
                                            verification.success ?
                                                (
                                                    <p>
                                                        Поздравляем, теперь можете заглянуть в профиль или посмотреть товары.
                                                    </p>
                                                )
                                                : (
                                                    <p>
                                                        Пожалуйста, проверте почту еще раз или нажмите&nbsp;
                                                        <a
                                                            href="#"
                                                            onClick={
                                                                (e) => {
                                                                    e.preventDefault();
                                                                    setSendMail(true);
                                                                    sendVerifyMail();
                                                                }
                                                            }
                                                        >сюда</a>
                                                        ,&nbsp; чтобы отправить письмо повторно.
                                                    </p>
                                                )
                                        }
                                    </React.Fragment>
                                )
                                : <h3 style={{color: "#fff"}}>Письмо успешно отправленно.</h3>
                        }

                    </motion.div>
                </Col>
            </Row>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const {verificationCode} = await ctx.query;
    const dataService = await new DataService();
    const verification = await dataService.verify(verificationCode)
        .catch((err) => err.response.data);

    return {
        props: {
            verification
        }
    }
};

const mapMethodsToProps = ({sendVerifyMail}) => ({
    sendVerifyMail
});

export default withGetData(VerificationPage, mapMethodsToProps);
