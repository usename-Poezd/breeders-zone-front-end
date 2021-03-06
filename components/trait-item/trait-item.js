import React, {Component, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faGenderless, faMars, faRubleSign, faVenus} from "@fortawesome/free-solid-svg-icons";
import { Col } from 'react-bootstrap';
import { Pipes } from '../../services';
import Link from "next/link";
import {withRouter} from "next/router";
import LazyImg from "../lazy-img";
import {withGetData} from "../hoc-helpers";
import {connect} from "react-redux";
import getSymbolFromCurrency from 'currency-symbol-map'
import currency from "currency.js";
import {setChatProduct, setReportModalProductId, setReportModalShow} from "../../actions";
import {currencyOptions} from "../../utils";

const TraitItem = (props) => {
     const {
         id,
         product_images,
         name,
         price,
         guards,
         ask_price,
         sex,
         group: groupSex,
         cb,
         user,
         preview,
         kind: {
             group,
             title_eng: kindTitle,
             id: kindId,
             only_text
         },
         sendMessage,
         verifyProduct,
         profile,
         setReportModalProductId,
         setReportModalShow,
         setChatProduct
     } = props;
    const { toUrl, transformCb } = new Pipes();
    const [isVerify, setVerify] = useState(!!guards.find((item) => item.id === profile.user.id));
    const {company_name, logo_img_url} = user;
    return (
        <Col xs={12} sm={6} ms={4} lg={3} className="item">
            <div className="list-item">
                <Link href="/shops/[shopName]" as={'/shops/' + company_name} >
                    <a className="profile">
                        <div className="profile-img">
                            {
                                logo_img_url ?
                                    <LazyImg
                                        src={logo_img_url}
                                        alt={name + ' | Breeders Zone'}
                                        className="img-fluid"
                                    />
                                    : <LazyImg
                                        src={'/images/icons/error-snake.svg'}
                                        alt="error-snake"
                                        className="img-fluid"
                                    />
                            }
                        </div>
                        <div className="profile-info">
                            <h3>{company_name}</h3>
                        </div>
                        {
                            profile.user.is_guard && profile.user.guardians_kinds.find((item) => item.id === kindId) ?
                                <div className="rate-block ml-auto" style={{top: 0}}>
                                    <div
                                        className={"check" + ((isVerify || !!guards.find((item) => item.id === profile.user.id)) ? ' active' : '')}
                                        style={{
                                            margin:0
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isVerify || !guards.find((item) => item.id === profile.user.id)) {
                                                setVerify(true);
                                                verifyProduct(id)
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faCheck} size="lg"/>
                                    </div>
                                    {
                                        !isVerify || !!guards.find((item) => item.id === profile.user.id) === false ?
                                            <div
                                                className="report text-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setReportModalProductId(id);
                                                    setReportModalShow(true);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faBan} size="lg"/>
                                            </div>
                                            : null
                                    }
                                </div>
                                : null
                        }
                    </a>
                </Link>
                <div className="item-body">
                    <Link href="/[group]/[kind]/[id]" as={`/${group}/${toUrl(kindTitle)}/${id}`}>
                        <a className="item-img">
                            {
                                preview ?
                                    <LazyImg
                                        src={preview.img_src}
                                        alt="asd"
                                        className="img-fluid"
                                    />
                                    : <LazyImg
                                        src={'/images/icons/error-snake.svg'}
                                        alt="asd"
                                        className="img-fluid"
                                    />

                            }
                        </a>
                    </Link>
                    <div className="item-info">
                        <Link href="/[group]/[kind]/[id]" as={`/${group}/${toUrl(kindTitle)}/${id}`}>
                            <a className="item-title h3">
                                {name}
                            </a>
                        </Link>
                        <div className="item-info-container d-flex justify-content-between align-items-center">
                            {
                                !only_text &&
                                <div className="cb-and-raiting">
                                    <div className="cb">
                                        <div className="d-flex sex">
                                            {
                                                groupSex !== null &&
                                                    <div className="d-flex align-items-center">
                                                        <span className="ml-0 mr-1">{groupSex.male}</span>
                                                        <FontAwesomeIcon icon={faMars} size="lg" className="sex-male"/>
                                                        <span className="ml-0">.</span>
                                                        <span className="ml-0 mr-1">{groupSex.female}</span>
                                                        <FontAwesomeIcon icon={faVenus} size="lg" className="sex-female"/>
                                                    </div>
                                            }
                                            {
                                                sex === null && groupSex === null &&
                                                <FontAwesomeIcon icon={faGenderless} size="lg"/>
                                            }
                                            {
                                                sex !== null && groupSex === null &&
                                                <FontAwesomeIcon icon={ sex ? faMars : faVenus} size="lg" className={'sex-' + (sex ? 'male' : 'female')}/>
                                            }
                                            <div className="ml-1">'{transformCb(cb)}</div>
                                        </div>
                                    </div>
                                    <div className="rating"></div>
                                </div>
                            }

                            <span className="price">
                                {
                                    !ask_price ?
                                        `${currency(price.find((item) => item.type === 'main').amount, currencyOptions).format()} ${getSymbolFromCurrency(price.find((item) => item.type === 'main').currency)}`
                                        : 'Цена по запросу'
                                }
                            </span>

                        </div>
                    </div>
                    <div className="btn-in-cart-container">
                        <div className="btn btn-main btn-in-cart" onClick={() => {
                            sendMessage(user);
                            setChatProduct({
                                id,
                                product_images,
                                name,
                                price,
                                guards,
                                sex,
                                cb,
                                user
                            })
                        }}>
                            <h3>Написать</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    );
};

 const mapMethodsToProps = ({verifyProduct}) => ({
     verifyProduct
 });

 const mapStateToProps = ({profile}) => ({
     profile
 });

export default connect(mapStateToProps, {setReportModalProductId, setReportModalShow, setChatProduct})(
    withRouter(
        withGetData(TraitItem, mapMethodsToProps)
    )
);
