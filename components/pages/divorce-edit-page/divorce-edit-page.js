import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Head from "next/head";
import {connect} from "react-redux";
import Spinner from "../../spinner";
import {
    clearDivorce, clearDivorceAcceptedFiles, clearDivorceError,
    clearDivorceSuccess,
    setDivorce, setDivorceError,
    setDivorceRequest,
    setDivorceSuccess,
    setDivorceUpdateRequest
} from "../../../actions";
import DivorceSettings from "../../divorce-settings";
import {withGetData} from "../../hoc-helpers";
import {withRouter} from "next/router";

class DivorceEditPage extends Component{

    UNSAFE_componentWillMount() {
        const { divorceSSR, setDivorce } = this.props;

        setDivorce({
            ...divorceSSR,
            sexPhotos: divorceSSR.sex_photos,
            masonryPhotos: divorceSSR.masonry_photos,
            exitPhotos: divorceSSR.exit_photos
        });
    }

    getDivorce = () => {
        const {getDivorce, router, setDivorce, setDivorceUpdateRequest } = this.props;

        getDivorce(router.query.id)
            .then( (data) => {
                setDivorce({
                    ...data,
                    sexPhotos: data.sex_photos,
                    masonryPhotos: data.masonry_photos,
                    exitPhotos: data.exit_photos
                });

                setDivorceUpdateRequest();
            })
    };

    submit = (data) => {
        const {
            divorce,
            setDivorceSuccess,
            setDivorceUpdateRequest,
            clearDivorceSuccess,
            setDivorceError,
            updateDivorce,
            clearDivorceError,
            router,
            clearDivorceAcceptedFiles
        } = this.props;

        setDivorceUpdateRequest();
        updateDivorce({
            ...data,
            male: divorce.male,
            female: divorce.female,
            cb: divorce.cb,
            acceptedFilesSex: divorce.acceptedFilesSex,
            acceptedFilesMasonry: divorce.acceptedFilesMasonry,
            acceptedFilesExit: divorce.acceptedFilesExit,
            sex_photos: divorce.sexPhotos,
            masonry_photos: divorce.masonryPhotos,
            exit_photos: divorce.exitPhotos,
        }, router.query.id)
            .then(async (data) => {
                this.getDivorce();
                clearDivorceAcceptedFiles();
                setDivorceSuccess(data.message);
                setTimeout(() => clearDivorceSuccess(), 5000);
            })
            .catch( (error) => {
                setDivorceUpdateRequest();
                setDivorceError({
                    errors: error.response.data.errors,
                    status: error.status
                });
                setTimeout(() => clearDivorceError(), 5000);
            });
    };

    render() {
        const { loginRequest, divorce, allKinds, user, router, isLogin } = this.props;

        if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
            router.push('/');
        }

        if(loginRequest || divorce.divorceRequest || divorce.updateRequest || allKinds.length === 0){
            return (
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={9} className="mt-3 py-5">
                            <Spinner/>
                        </Col>
                    </Row>
                </Container>
            )
        }

        return (
            <React.Fragment>
                <Head>
                    <title>{divorce.title} | Breeders Zone</title>
                </Head>
                <Container>
                    <DivorceSettings submit={this.submit}/>
                </Container>
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({divorce, kinds: {all: allKinds}, auth: {loginRequest, isLogin}, profile: {user}}) => ({
    divorce,
    allKinds,
    loginRequest,
    user,
    isLogin
});

const mapMethodsToProps = ({updateDivorce, getDivorce}) => ({
    updateDivorce,
    getDivorce
});


export default connect(mapStateToProps, {
    setDivorce,
    setDivorceRequest,
    clearDivorceAcceptedFiles,
    setDivorceSuccess,
    setDivorceUpdateRequest,
    clearDivorce,
    clearDivorceSuccess,
    setDivorceError,
    clearDivorceError,
})(
    withRouter(
        withGetData(DivorceEditPage, mapMethodsToProps)
    )
);
