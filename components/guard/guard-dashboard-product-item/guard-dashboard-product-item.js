import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import {Pipes} from "../../../services";
import Link from "next/link";
import {setReportModalProductId, setReportModalShow} from "../../../redux/actions";
import {connect} from "react-redux";
import moment from "moment";

const GuardDashboardProductItem = ({id, product_images, kind, subcategory, locality, sex, cb, morphs, name, onVerify, setReportModalProductId, setReportModalShow}) => {
    const {toTraitClass, toUrl} = new Pipes();
    return (
        <div className="products-item feather-shadow d-flex">
            <div className="products-item-img">
                <Link href="/[group]/[kind]/[id]" as={toUrl(`/${kind.group}/${kind.title_eng}/${id}`)}>
                    <a>
                        {
                            product_images[0] ?
                                <img
                                    src={product_images[0].img_src}
                                    alt={name}
                                    className="img-fluid"
                                />
                                : null
                        }
                    </a>
                </Link>
            </div>
            <div className="products-item-info">
                <h2 className="product-title font-weight-bold">
                    <Link href="/[group]/[kind]/[id]" as={toUrl(`/${kind.group}/${kind.title_eng}/${id}`)}>
                        <a>{name}</a>
                    </Link>
                </h2>
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
                        locality ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Локалитет:</h3>
                                    <div className="info morphs d-inline-block">
                                        <div className="morph-indicator morph-other-normal d-inline-block">{locality.title}</div>
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
                        <h3 className="info info-text">{moment(cb).format('DD.MM.YYYY')}</h3>
                    </li>
                    {
                        morphs.length !== 0 ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Морфы:</h3>
                                    <div className="info morphs d-inline-block">
                                        {
                                            morphs.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title}{gene.title}</div>)
                                        }
                                    </div>
                                </li>
                            )
                            : null
                    }
                </ul>
                <div className="rate-block">
                    <div className="check" onClick={() => onVerify(id)}>
                        <FontAwesomeIcon icon={faCheck} size="lg"/>
                    </div>
                    <div
                        className="report text-danger"
                        onClick={() => {
                            setReportModalProductId(id);
                            setReportModalShow(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} size="lg"/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default connect(null, {setReportModalProductId, setReportModalShow})(GuardDashboardProductItem);
