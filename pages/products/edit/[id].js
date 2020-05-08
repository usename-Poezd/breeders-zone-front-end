import React, {Component} from "react";
import ProductSettings from "../../../components/product-settings";
import {withGetData} from "../../../components/hoc-helpers";
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
import Spinner from "../../../components/spinner";
// import BreadCrumbs from "../../bread-crumbs/bread-crumbs";
import {isLogin} from "../../../utils";
import {withRouter} from "next/router";
import Header from "../../../components/header/header";
import {DataService} from "../../../services";
import Head from "next/head";


class ProductEditPage extends Component{
    componentWillMount() {
        const {productSSR, setProductInfo} = this.props;
        console.log(productSSR);
        const cb = new Date(productSSR.cb);

        setProductInfo({
            info:{
                ...productSSR,
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

    getStateProduct = () => {
        const {router, getProduct, setGetProductRequest, clearGetProductRequest, setProductInfo } = this.props;

        setGetProductRequest();
        getProduct(router.query.id)
            .then( data => {
                const cb = new Date(data.cb);
                setProductInfo({
                    info:{
                        ...data,
                        sex: String(data.sex),
                        kindId: data.kind_id,
                        cb,
                        age: data.age.title
                    },
                    product_images: data.product_images,
                    selectedMorphs: data.morphs,
                    localities: data.localities
                });
                clearGetProductRequest();
            });
    };

    submit = (data) => {
        const {
            setProductUpdateRequest,
            updateProduct,
            setProductUpdateSuccess,
            setProductUpdateError,
            product: {info:{cb}, acceptedFiles, selectedMorphs, deletedImages, localities},
            router,
            productUpdateClearSuccess,
            productUpdateClearError,
            getKinds,
        } = this.props;
        setProductUpdateRequest();
        updateProduct({
            id: router.query.id,
            ...data,
            cb,
            product_images: acceptedFiles,
            deletedImages: deletedImages,
            morphs: selectedMorphs,
            localities
        })
            .then( async (data) => {
                setProductUpdateSuccess(data.success);
                getKinds();
                this.getStateProduct();
                setTimeout(()=> productUpdateClearSuccess(), 5000);
            })
            .catch( error => {
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
            router
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

        if (!(user.is_breeder || isLogin()) && typeof window !== 'undefined'){
            router.push('/');
        }

        return (
            <React.Fragment>
                <Container>
                    <ProductSettings
                        submit={this.submit}
                    />
                </Container>
            </React.Fragment>
        )
    }
}

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const productSSR = await dataService.getProduct(ctx.query.id);

    return {
        props: {
            productSSR
        }
    }
};

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}}) => ({
    user,
    product,
    allKinds,
    loginRequest
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