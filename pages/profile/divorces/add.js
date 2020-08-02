import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import Head from "next/head";
import {connect} from "react-redux";
import Spinner from "../../../components/spinner";
import {
    clearDivorce, clearDivorceError,
    clearDivorceSuccess, setDivorceError,
    setDivorceSuccess,
    setDivorceUpdateRequest
} from "../../../actions";
import DivorceSettings from "../../../components/divorce-settings";
import {withGetData} from "../../../components/hoc-helpers";
import {withRouter} from "next/router";
import {serverRedirect} from "../../../utils";

const AddDivorcePage = (props) => {

    const submit = (data) => {
        const {
            divorce,
            setDivorceSuccess,
            setDivorceUpdateRequest,
            clearDivorce,
            clearDivorceSuccess,
            setDivorceError,
            setDivorce,
            clearDivorceError
        } = props;

        setDivorceUpdateRequest();
        setDivorce({
            ...data,
            male: divorce.male,
            female: divorce.female,
            cb: divorce.cb,
            acceptedFilesSex: divorce.acceptedFilesSex,
            acceptedFilesMasonry: divorce.acceptedFilesMasonry,
            acceptedFilesExit: divorce.acceptedFilesExit
        })
            .then((data) => {
                setDivorceSuccess(data.message);
                setDivorceUpdateRequest();
                clearDivorce();
                setTimeout(() => clearDivorceSuccess(), 5000);
            })
            .catch( (error) => {
                setDivorceError({
                    errors: error.response.data.errors,
                    status: error.status
                });
                setDivorceUpdateRequest();
                setDivorce({
                    ...data,
                    male: divorce.male,
                    female: divorce.female,
                    cb: divorce.cb,
                });

                setTimeout(() => clearDivorceError(), 5000)
            });
    };

    const { loginRequest, divorce, allKinds, user, router, isLogin } = props;

    if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
        return router.push('/');
    }

    if(loginRequest || divorce.divorceRequest || divorce.updateRequest || allKinds.length === 0){
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <React.Fragment>
            <Head>
                <title>Добавить развод | Breeders Zone</title>
            </Head>
            <Container>
                <DivorceSettings submit={submit}/>
            </Container>
        </React.Fragment>
    )
};

const mapStateToProps = ({divorce, kinds: {all: allKinds}, auth: {loginRequest, isLogin}, profile: {user}}) => ({
    divorce,
    allKinds,
    loginRequest,
    user,
    isLogin
});

const mapMethodsToProps = ({setDivorce}) => ({
    setDivorce
});


export const getServerSideProps = (ctx) => {
    serverRedirect(ctx);

    return {
        props: {}
    }
};

export default connect(mapStateToProps, {
    setDivorceSuccess,
    setDivorceUpdateRequest,
    clearDivorce,
    clearDivorceSuccess,
    setDivorceError,
    clearDivorceError,
})(
    withRouter(withGetData(AddDivorcePage, mapMethodsToProps))
);
