import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMars, faPen, faRubleSign, faTimes, faVenus} from "@fortawesome/free-solid-svg-icons";
import {withGetData} from "../hoc-helpers";
import {deleteShopProduct, getKinds} from "../../actions";
import Link from "next/link";
import {connect} from "react-redux";
import {formatDate} from 'react-day-picker/moment';
import {Pipes} from "../../services";

const ShopProductsItem = ({id, idx, name, sex, cb, morphs, price, kind, subcategory, localities, product_images, deleteProduct, deleteShopProduct, getKinds}) => {
    const delProduct = () => {
        deleteShopProduct({idx});
        getKinds();
        deleteProduct({productId: id});
    };

    const { toTraitClass } = new Pipes();

    return (
        <div className="products-item feather-shadow d-flex">
            <div className="products-item-img">
                {
                    product_images[0] ?
                        <img
                            src={product_images[0].img_src}
                            alt={name}
                            className="img-fluid"
                        />
                        : null
                }
            </div>
            <div className="products-item-info">
                <h2 className="font-weight-bold">{name}</h2>
                <ul>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Категория:</h3>
                        <h3 className="info info-text">{kind.title_eng}</h3>
                    </li>
                    {
                        subcategory ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Под вид:</h3>
                                    <h3 className="info info-text">{subcategory.title}</h3>
                                </li>
                            )
                            : null
                    }
                    {
                        localities.length !== 0 ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Локалитеты:</h3>
                                    <div className="info morphs d-inline-block">
                                        {
                                            localities.map( ({title}) => <div key={title} className="morph-indicator morph-other-normal d-inline-block">{title}</div>)
                                        }
                                    </div>
                                </li>
                            )
                            : null
                    }
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Пол:</h3>
                        <FontAwesomeIcon icon={sex ? faMars : faVenus} size="lg" className={"info sex-" + (sex ? 'male' : 'female') } />
                    </li>
                    <li className="product-card-info-item">
                        <h3 className="title">Дата рождения:</h3>
                        <h3 className="info info-text">{formatDate(new Date(cb), 'DD/MM/YYYY', 'ru')}</h3>
                    </li>
                    <li className="product-card-info-item flex-row">
                        <h3 className="title">Цена:</h3>
                        <h3 className="info">
                            {price}
                            <FontAwesomeIcon icon={faRubleSign} size="sm" className="ml-1"/>
                        </h3>
                    </li>
                    {
                        morphs.length !== 0 ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Морфы:</h3>
                                    <div className="info morphs d-inline-block">
                                        {
                                            morphs.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title} {gene.title}</div>)
                                        }
                                    </div>
                                </li>
                            )
                            : null
                    }
                </ul>
            </div>
            <div className="products-item-controls-container d-flex flex-column flex-sm-row flex-md-column justify-content-center align-items-center">
                <div className="products-item-views">
                    <FontAwesomeIcon icon={faEye}/>
                    <span className="views">123</span>
                </div>
                <div className="products-item-controls d-flex align-items-start justify-content-center">
                    <Link href="/products/edit/[id]" as={`/products/edit/${id}`} >
                        <a className="products-item-controls-item">
                            <FontAwesomeIcon icon={faPen}/>
                        </a>
                    </Link>
                    <div className="products-item-controls-item times pointer-event" onClick={() => delProduct()}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapMethodsToProps = ({deleteProduct}) => ({
    deleteProduct
});

export default connect(null, {deleteShopProduct, getKinds})(withGetData(ShopProductsItem, mapMethodsToProps));
