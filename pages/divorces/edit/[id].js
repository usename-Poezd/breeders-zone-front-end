import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Header from "../../../components/header";
import Head from "next/head";
import {connect} from "react-redux";
import {isLogin} from "../../../utils";
import Spinner from "../../../components/spinner";
import {
    clearDivorce, clearDivorceAcceptedFiles, clearDivorceError,
    clearDivorceSuccess,
    setDivorce, setDivorceError,
    setDivorceRequest,
    setDivorceSuccess,
    setDivorceUpdateRequest
} from "../../../actions";
import DivorceSettings from "../../../components/divorce-settings";
import {withGetData} from "../../../components/hoc-helpers";
import {withRouter} from "next/router";
import {DataService} from "../../../services";

class DivorceEditPage extends Component{

    componentWillMount() {
        const { divorceSSR, setDivorce } = this.props;

        setDivorce({
            ...divorceSSR,
            kindId: divorceSSR.kind_id,
            subcategoryId: divorceSSR.subcategory_id,
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
                    kindId: data.kind_id,
                    subcategoryId: data.subcategory_id,
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
            id: router.query.id,
            ...data,
            male: divorce.male,
            female: divorce.female,
            cb: divorce.cb,
            acceptedFilesSex: divorce.acceptedFilesSex,
            acceptedFilesMasonry: divorce.acceptedFilesMasonry,
            acceptedFilesExit: divorce.acceptedFilesExit,
            sexPhotos: divorce.sexPhotos,
            masonryPhotos: divorce.masonryPhotos,
            exitPhotos: divorce.exitPhotos,
        })
            .then((data) => {
                setDivorceSuccess(data.message);
                clearDivorceAcceptedFiles();
                this.getDivorce();
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
        const { loginRequest, divorce, allKinds, user, router, divorceSSR } = this.props;

        if (!(user.is_breeder || isLogin()) && typeof window !== 'undefined'){
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
                    <title>{divorce.title}</title>
                </Head>
                <Container>
                    <DivorceSettings submit={this.submit}/>
                </Container>
            </React.Fragment>
        )
    }
}

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const divorceSSR = await dataService.getDivorce(ctx.query.id);

    return {
        props: {
            divorceSSR
        }
    }
};

const mapStateToProps = ({divorce, kinds: {all: allKinds}, auth: {loginRequest}, profile: {user}}) => ({
    divorce,
    allKinds,
    loginRequest,
    user
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