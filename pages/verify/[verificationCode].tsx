import React, {useState} from "react";
import {DataService} from "../../services";
import {Col, Container, Row} from "react-bootstrap";
import Head from "next/head";
import {useDataService} from "../../hooks";
import {NextPageContext} from "next";

interface IVerificationPageProps {
    verification: {
        success: boolean
        message: string
    }
}

const VerificationPage = ({verification}: IVerificationPageProps) => {
    const [sendMail, setSendMail] = useState(false);
    const dataService = useDataService();

    return (
        <Container>
            <Head>
                <title>{!verification.success ? 'Ой ой, что-то пошло не так' : 'Активация акаунта и подтверждения почты'} | Breeders Zone</title>
            </Head>
            <Row style={{marginTop: 20}}>
                <Col xs={12}>
                    <div
                        className="shop-container"
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
                                                                    dataService.sendVerifyEmail();
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

                    </div>
                </Col>
            </Row>
        </Container>
    )
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    const {verificationCode} = await ctx.query;
    const dataService = await new DataService();
    const verification = await dataService.verify(String(verificationCode))
        .catch((err) => err.response.data);

    return {
        props: {
            verification
        }
    }
};

export default VerificationPage;
