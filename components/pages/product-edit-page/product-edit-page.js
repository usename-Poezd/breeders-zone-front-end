import React, {Component} from "react";
import ProductSettings from "../../product-settings";
import {withGetData} from "../../hoc-helpers";
import {
    clearGetProductRequest,
    getKinds,
    productUpdateClear,
    productUpdateClearError,
    productUpdateClearSuccess, setGetProductRequest,
    setProductInfo,
    setProductUpdateError,
    setProductUpdateRequest,
    setProductUpdateSuccess,
} from "../../../actions";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import Spinner from "../../spinner";
import {withRouter} from "next/router";
import Head from "next/head";
import moment from "moment";

class ProductEditPage extends Component{
    UNSAFE_componentWillMount() {
        const {productSSR, setProductInfo} = this.props;
        const cb = moment(productSSR.cb).toISOString();

        setProductInfo({
            info:{
                ...productSSR,
                price: productSSR.price.find((item) => item.currency === productSSR.currency).amount,
                sex: String(productSSR.sex),
                kindId: productSSR.kind_id,
                cb,
                age: productSSR.age.title
            },
            product_images: productSSR.product_images,
            selectedMorphs: productSSR.morphs,
            localities: productSSR.localities
        });
    }

    componentWillUnmount() {
        const { productUpdateClear, productUpdateClearError, productUpdateClearSuccess } = this.props;
        productUpdateClear();
        productUpdateClearError();
        productUpdateClearSuccess();
    }

    submit = (data) => {
        const {
            setProductUpdateRequest,
            updateProduct,
            setProductUpdateSuccess,
            setProductUpdateError,
            product: {info, acceptedFiles, selectedMorphs, deletedImages, localities},
            router,
            productUpdateClearSuccess,
            productUpdateClearError,
            getKinds,
            setProductInfo,
            clearGetProductRequest
        } = this.props;

        const options = {
            ...data,
            locality_id: data.locality_id !== 'none' ? data.locality_id : null,
            cb: info.cb,
            product_images: acceptedFiles,
            deletedImages: deletedImages,
            morphs: selectedMorphs,
            localities
        };

        if (selectedMorphs.length === 0) {
            options.delete_all_morphs = true;
        }

        setProductUpdateRequest();
        updateProduct(options, router.query.id)
            .then( async (data) => {
                setProductUpdateSuccess(data.success);
                getKinds();
                const cb = moment(data.cb).toISOString();
                setProductInfo({
                    info:{
                        ...data.data,
                        price: data.data.price.find((item) => item.currency === data.data.currency).amount,
                        sex: String(data.data.sex),
                        kindId: data.data.kind_id,
                        cb,
                        age: data.data.age.title
                    },
                    product_images: data.data.product_images,
                    selectedMorphs: data.data.morphs,
                    localities: data.data.localities
                });
                clearGetProductRequest();

                setTimeout(() => productUpdateClearSuccess(), 5000);
            })
            .catch( error => {
                setProductUpdateError({
                    product: {
                        info: {
                            ...info,
                            ...data,
                            cb: info.cb
                        },
                        morphs: selectedMorphs,
                        localities
                    },
                    errors: error.response.data.errors,
                    status: error.status
                });
                setTimeout(() => productUpdateClearError(), 5000);
            });
    };

    render() {
        const {
            product,
            user,
            allKinds,
            loginRequest,
            router,
            isLogin,
            productSSR
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
            <React.Fragment>
                <Head>
                    <title>{product.info.name ? productSSR.name : product.info.name} | Breeders Zone</title>
                </Head>
                <Container>
                    <ProductSettings
                        submit={this.submit}
                    />
                </Container>
            </React.Fragment>
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

const mapMethodsToProps = ({updateProduct, getProduct}) => ({
    updateProduct,
    getProduct
});

export default connect(mapStateToProps, {
    setGetProductRequest,
    getKinds,
    setProductInfo,
    clearGetProductRequest,
    setProductUpdateRequest,
    setProductUpdateSuccess,
    setProductUpdateError,
    productUpdateClear,
    productUpdateClearSuccess,
    productUpdateClearError,
})(
    withRouter(
        withGetData(ProductEditPage, mapMethodsToProps)
    )
);
