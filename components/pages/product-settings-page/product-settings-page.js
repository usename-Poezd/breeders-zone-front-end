import React, {Component} from "react";
import ProductSettings from "../../product-settings";
import {withGetData} from "../../hoc-helpers";
import {
    clearDeletedMorphsKind,
    clearGetProductRequest, clearLocalities, clearSearchResult,
    deleteAcceptedFile, deleteLocality, deleteMorphsKind,
    deleteProductStateImg, deleteSelectedMorph, getKinds,
    productUpdateClear,
    productUpdateClearError,
    productUpdateClearSuccess,
    setAcceptedFiles, setGetProductRequest, setLocality,
    setProductCb,
    setProductInfo, setProductSearchResult,
    setProductUpdateError,
    setProductUpdateRequest,
    setProductUpdateSuccess, setSelectedMorph, updateProductLocality
} from "../../../actions";
import {connect} from "react-redux";
import {Col, Row} from "react-bootstrap";
import Spinner from "../../spinner";
// import BreadCrumbs from "../../bread-crumbs/bread-crumbs";
import {isLogin} from "../../../utils";
import {withRouter} from "next/router";


class ProductSettingsPage extends Component{

    // componentDidMount() {
    //     const { router } = this.props;
    //     console.log(router)
    //     // this.getStateProduct();
    // }
    //
    // componentWillUnmount() {
    //     this.props.productUpdateClear()
    // }
    //
    //
    // // getStateProduct = () => {
    // //     const { match, getProduct, setGetProductRequest, clearGetProductRequest, setProductInfo, productUpdateClear } = this.props;
    // //
    // //     if (match.params.productId){
    // //         setGetProductRequest();
    // //         getProduct(match.params.productId)
    // //             .then( data => {
    // //                 const cb = new Date(data.cb);
    //                 setProductInfo({
    //                     info:{
    //                         ...data,
    //                         sex: String(data.sex),
    //                         kindId: data.kind_id,
    //                         cb,
    //                         age: data.age.title
    //                     },
    //                     product_images: data.product_images,
    //                     selectedMorphs: data.morphs,
    //                     localities: data.localities
    //                 });
    // //                 clearGetProductRequest();
    // //             });
    // //         return true;
    // //     }
    // //
    // //     productUpdateClear();
    // // };
    //
    // submit = (data) => {
    //     const {
    //         setProductUpdateRequest,
    //         setProduct,
    //         setProductUpdateSuccess,
    //         productUpdateClear,
    //         setProductUpdateError,
    //         product: {info:{id, cb}, acceptedFiles, selectedMorphs, deletedMorphs, deletedImages, localities},
    //         match,
    //         updateProduct,
    //         productUpdateClearSuccess,
    //         productUpdateClearError,
    //         getKinds
    //     } = this.props;
    //     setProductUpdateRequest();
    //
    //     if (match.params.productId){
    //         updateProduct({
    //             id: match.params.productId,
    //             ...data,
    //             cb,
    //             product_images: acceptedFiles,
    //             deletedImages: deletedImages,
    //             morphs: selectedMorphs,
    //             localities
    //         })
    //             .then( data => {
    //                 setProductUpdateSuccess(data.success);
    //                 getKinds();
    //                 this.getStateProduct();
    //                 setTimeout(()=> productUpdateClearSuccess(), 5000);
    //             })
    //             .catch( error => {
    //                 setProductUpdateError({
    //                     product: {
    //                         info: {
    //                             ...data,
    //                             cb
    //                         },
    //                         morphs: selectedMorphs,
    //                         localities
    //                     },
    //                     errors: error.response.data.errors,
    //                     status: error.status
    //                 });
    //                 setTimeout(()=> productUpdateClearError(), 5000);
    //             });
    //     }else {
    //         setProduct({
    //             ...data,
    //             cb,
    //             product_images: acceptedFiles,
    //             morphs: selectedMorphs,
    //             localities
    //         })
    //             .then( data => {
    //                 setProductUpdateSuccess(data.success);
    //                 getKinds();
    //                 productUpdateClear();
    //                 setTimeout(()=> productUpdateClearSuccess(), 5000);
    //             })
    //             .catch( (error) => {
    //                 setProductUpdateError({
    //                     product: {
    //                         info: {
    //                             ...data,
    //                             cb
    //                         },
    //                         morphs: selectedMorphs,
    //                         localities
    //                     },
    //                     errors: error.response.data.errors,
    //                     status: error.status
    //                 });
    //                 setTimeout(()=> productUpdateClearError(), 5000);
    //             });
    //     }
    // };

    render() {
        // const {
        //     product,
        //     user,
        //     setProductCb,
        //     setAcceptedFiles,
        //     deleteAcceptedFile,
        //     deleteProductImg,
        //     deleteProductStateImg,
        //     searchMorphs,
        //     setSelectedMorph,
        //     deleteSelectedMorph,
        //     clearSearchResult,
        //     setProductSearchResult,
        //     allKinds,
        //     deleteMorphsKind,
        //     clearDeletedMorphsKind,
        //     setLocality,
        //     clearLocalities,
        //     deleteLocality,
        //     updateProductLocality,
        //     loginRequest
        // } = this.props;
        //
        // if(loginRequest || product.updateRequest || product.getRequest || allKinds.length === 0){
        //     return (
        //         <Row className="justify-content-center">
        //             <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
        //                 <Spinner/>
        //             </Col>
        //         </Row>
        //     )
        // }
        //
        // if (!user.is_breeder && !isLogin() && typeof window !== 'undefined'){
        //     this.props.router.push('/');
        // }

        return (
            <div>

            </div>
            // <React.Fragment>
            //     <ProductSettings
            //         allKinds={allKinds}
            //         submit={this.submit}
            //         product={product}
            //         setProductCb={(cb) => setProductCb(cb)}
            //         deleteProductImg={(id) => deleteProductImg({id})}
            //         deleteProductStateImg={(idx) => deleteProductStateImg(idx)}
            //         setAcceptedFiles={(acceptedFiles) => setAcceptedFiles(acceptedFiles)}
            //         deleteAcceptedFile={(idx) => deleteAcceptedFile(idx)}
            //         searchMorphs={(data) => searchMorphs(data)}
            //         setSelectedMorph={(idx) => setSelectedMorph(idx)}
            //         deleteSelectedMorph={(idx) => deleteSelectedMorph(idx)}
            //         clearSearchResult={() => clearSearchResult()}
            //         setProductSearchResult={(data) => setProductSearchResult(data)}
            //         deleteMorphsKind={deleteMorphsKind}
            //         clearDeletedMorphsKind={clearDeletedMorphsKind}
            //         setLocality={setLocality}
            //         clearLocalities={clearLocalities}
            //         deleteLocality={deleteLocality}
            //         updateProductLocality={updateProductLocality}
            //     />
            // </React.Fragment>
        )
    }
}

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}}) => ({
    user,
    product,
    allKinds,
    loginRequest
});

const mapMethodsToProps = ({setProduct, getProduct, deleteProductImg, updateProduct}) => ({
    setProduct,
    getProduct,
    deleteProductImg,
    updateProduct
});

export default connect(mapStateToProps, {
    setProductUpdateRequest,
    setProductUpdateSuccess,
    setProductUpdateError,
    productUpdateClear,
    setProductCb,
    setAcceptedFiles,
    deleteAcceptedFile,
    setProductInfo,
    deleteProductStateImg,
    productUpdateClearSuccess,
    productUpdateClearError,
    setGetProductRequest,
    clearGetProductRequest,
    setProductSearchResult,
    setSelectedMorph,
    deleteSelectedMorph,
    clearSearchResult,
    deleteMorphsKind,
    clearDeletedMorphsKind,
    setLocality,
    clearLocalities,
    deleteLocality,
    getKinds,
    updateProductLocality
})(
    withRouter(
        withGetData(ProductSettingsPage, mapMethodsToProps)
    )
);
