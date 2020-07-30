import React, {Component} from "react";
import ProductSettings from "../../components/product-settings";
import {withGetData} from "../../components/hoc-helpers";
import {
    getKinds,
    productUpdateClear,
    productUpdateClearError,
    productUpdateClearSuccess,

    setProductUpdateError,
    setProductUpdateRequest,
    setProductUpdateSuccess,
} from "../../actions";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import Spinner from "../../components/spinner";
import {withRouter} from "next/router";
import Head from "next/head";


class ProductSettingsPage extends Component{

    componentWillUnmount() {
        const { productUpdateClear, productUpdateClearError, productUpdateClearSuccess } = this.props;
        productUpdateClear();
        productUpdateClearError();
        productUpdateClearSuccess();
    }

    submit = (data) => {
        const {
            setProductUpdateRequest,
            setProduct,
            setProductUpdateSuccess,
            productUpdateClear,
            setProductUpdateError,
            product: {info:{id, cb}, acceptedFiles, selectedMorphs, localities},
            productUpdateClearSuccess,
            productUpdateClearError,
            getKinds,
        } = this.props;
        setProductUpdateRequest();

        setProduct({
            ...data,
            locality_id: data.locality_id !== 'none' ? data.locality_id : null,
            cb,
            product_images: acceptedFiles,
            morphs: selectedMorphs,
            localities
        })
            .then( data => {
                setProductUpdateSuccess(data.success);
                productUpdateClear();
                getKinds();
                setTimeout(()=> productUpdateClearSuccess(), 5000);
            })
            .catch( (error) => {
                setProductUpdateError({
                    product: {
                        info: {
                            ...data,
                            cb
                        },
                        morphs: selectedMorphs,
                        localities
                    },
                    errors: error.response.data.errors,
                    status: error.status
                });
                setTimeout(()=> productUpdateClearError(), 5000);
            });
    };

    render() {
        const {
            product,
            user,
            allKinds,
            loginRequest,
            isLogin
        } = this.props;

        if(loginRequest || product.updateRequest || product.getRequest || allKinds.length === 0){
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

        if ((!user.is_breeder || !isLogin) && typeof window !== 'undefined'){
            router.push('/');
        }

        return (
            <Container>
                <Head>
                    <title>Добавить товар | Breeders Zone</title>
                </Head>
                <ProductSettings
                    submit={this.submit}
                />
            </Container>
        )
    }
}

const mapStateToProps = ({auth: {loginRequest, isLogin}, product, profile: {user}, kinds: {all: allKinds}}) => ({
    user,
    product,
    allKinds,
    loginRequest,
    isLogin
});

const mapMethodsToProps = ({setProduct}) => ({
    setProduct
});

export default connect(mapStateToProps, {
    getKinds,
    setProductUpdateRequest,
    setProductUpdateSuccess,
    setProductUpdateError,
    productUpdateClear,
    productUpdateClearSuccess,
    productUpdateClearError,
})(
    withRouter(
        withGetData(ProductSettingsPage, mapMethodsToProps)
    )
);
