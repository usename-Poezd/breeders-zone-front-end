import React, {FC, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faGenderless, faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import { Col } from 'react-bootstrap';
import Link from "next/link";
import LazyImg from "../../..//lazy-img";
import {connect} from "react-redux";
import getSymbolFromCurrency from 'currency-symbol-map'
import currency from "currency.js";
import {setReportModalProductId, setReportModalShow} from "../../../../redux/actions";
import {setChatProduct} from "../../../../redux/Chat";
import {currencyOptions, toUrl, transformCb} from "../../../../utils";
import {IProductListItemDispatchProps, IProductListItemStateProps, ProductListItemPropsType} from "./types";
import {IRootState} from "../../../../redux/store";
import {useDataService} from "../../../../hooks";

const ProductListItemComponent: FC<ProductListItemPropsType> = (props) => {
    const {
        id,
        product_images,
        name,
        price,
        guards,
        sex,
        cb,
        shop,
        preview,
        kind: {
            group,
            title_eng: kindTitle,
            id: kindId
        },
        sendMessage,
        user,
        setReportModalProductId,
        setReportModalShow,
        setChatProduct
    } = props;
    const [isVerify, setVerify] = useState(!!guards.find((item) => item.id === user?.id));
    const {company_name, logo_img_url} = shop;
    const dataService = useDataService();
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="item">
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
                            user?.is_guard && user?.guardians_kinds.find((item) => item.id === kindId) ?
                                <div className="rate-block ml-auto" style={{top: 0}}>
                                    <div
                                        className={"check" + ((isVerify || !!guards.find((item) => item.id === user?.id)) ? ' active' : '')}
                                        style={{
                                            margin:0
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isVerify || !guards.find((item) => item.id === user?.id)) {
                                                setVerify(true);
                                                dataService.verifyProduct(id)
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faCheck} size="lg"/>
                                    </div>
                                    {
                                        !isVerify || !!guards.find((item) => item.id === user?.id) === false ?
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
                            <div className="cb-and-raiting">
                                <div className="cb">
                                    <div className="sex">
                                        {
                                            sex !== null ?
                                                <FontAwesomeIcon icon={ sex ? faMars : faVenus} size="lg" className={'sex-' + (sex ? 'male' : 'female')}/>
                                                : <FontAwesomeIcon icon={faGenderless} size="lg"/>
                                        }
                                        <span>'{transformCb(cb)}</span>
                                    </div>
                                </div>
                                <div className="rating"></div>
                            </div>
                            <span className="price">
                                {currency(price.find((item) => item.type === 'main').amount, currencyOptions).format()}&nbsp;
                                {getSymbolFromCurrency(price.find((item) => item.type === 'main').currency)}
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

const mapStateToProps = ({profile: {user}}: IRootState): IProductListItemStateProps => ({
    user
});

const ProductListItem = connect<IProductListItemStateProps, IProductListItemDispatchProps>(mapStateToProps, {setReportModalProductId, setReportModalShow, setChatProduct})(ProductListItemComponent);

export {
    ProductListItem
}
