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
// import BreadCrumbs from "../../bread-crumbs/bread-crumbs";
import {isLogin} from "../../utils";
import {withRouter} from "next/router";
import Header from "../../components/header/header";


class ProductSettingsPage extends Component{

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
            loginRequest
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
            this.props.router.push('/');
        }

        return (
            <Container>
                <ProductSettings
                    submit={this.submit}
                />
            </Container>
        )
    }
}

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}}) => ({
    user,
    product,
    allKinds,
    loginRequest
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