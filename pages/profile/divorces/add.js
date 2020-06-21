import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import Header from "../../../components/header/header";
import Head from "next/head";
import ShopDivorces from "../../../components/shop-divorces/shop-divorces";
import {connect} from "react-redux";
import {isLogin} from "../../../utils";
import Spinner from "../../../components/spinner";
import {
    clearDivorce, clearDivorceError,
    clearDivorceSuccess,
    setDivorce, setDivorceError,
    setDivorceRequest,
    setDivorceSuccess,
    setDivorceUpdateRequest
} from "../../../actions";
import DivorceSettings from "../../../components/divorce-settings";
import {withGetData} from "../../../components/hoc-helpers";

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

    const { loginRequest, divorce, allKinds, user, router } = props;

    if (!(user.is_breeder || isLogin()) && typeof window !== 'undefined'){
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
                <title>Мои разводы</title>
            </Head>
            <Container>
                <DivorceSettings submit={submit}/>
            </Container>
        </React.Fragment>
    )
};

const mapStateToProps = ({divorce, kinds: {all: allKinds}, auth: {loginRequest}, profile: {user}}) => ({
    divorce,
    allKinds,
    loginRequest,
    user
});

const mapMethodsToProps = ({setDivorce}) => ({
    setDivorce
});


export default connect(mapStateToProps, {
    setDivorceSuccess,
    setDivorceUpdateRequest,
    clearDivorce,
    clearDivorceSuccess,
    setDivorceError,
    clearDivorceError,
})(
    withGetData(AddDivorcePage, mapMethodsToProps)
);