import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faRubleSign, faVenus } from "@fortawesome/free-solid-svg-icons";
import { Col } from 'react-bootstrap';
import { Pipes } from '../../services';
import Link from "next/link";
import {withRouter} from "next/router";

 const ListItem = ({ id, product_images, name, price, sex, cb, user, kind: {group, title_eng: kindTitle}, sendMessage }) => {
        const { toUrl, transformCb } = new Pipes();
        const {company_name, logo_img_url} = user;
        return (
            <Col xs={12} sm={6} ms={4} lg={3} className="item">
                <div className="list-item">
                    <Link href="/shops/[shopName]" as={'/shops/' + toUrl(company_name)} >
                        <a className="profile">
                            <div className="profile-img">
                                {
                                    logo_img_url ?
                                        <img
                                            src={logo_img_url}
                                            alt="asd"
                                            className="img-fluid"
                                        />
                                        : <img
                                            src={'/images/icons/error-snake.svg'}
                                            alt="asd"
                                            className="img-fluid"
                                        />

                                }
                            </div>
                            <div className="profile-info">
                                <h3>{company_name}</h3>
                            </div>
                        </a>
                    </Link>
                    <div className="item-body">
                        <Link href="/[group]/[kind]/[id]" as={`/${group}/${toUrl(kindTitle)}/${id}`}>
                            <a className="item-img">
                                {
                                    product_images[0] ?
                                        <img
                                            src={product_images[0].img_src}
                                            alt="asd"
                                            className="img-fluid item-img"
                                        />
                                        : <img
                                            src={'/images/icons/error-snake.svg'}
                                            alt="asd"
                                            className="img-fluid item-img"
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
                                            <FontAwesomeIcon icon={ sex ? faMars : faVenus} size="lg" className={'sex-' + (sex ? 'male' : 'female')}/>
                                            <span>'{transformCb(cb)}</span>
                                        </div>
                                    </div>
                                    <div className="rating"></div>
                                </div>
                                <span className="price">
                                    {price}
                                    <FontAwesomeIcon icon={faRubleSign} size="sm" />
                                </span>

                            </div>
                        </div>
                        <div className="btn-in-cart-container">
                            <div className="btn-main btn-in-cart" onClick={() => sendMessage(user)}>
                                <h3>Написать</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        );
};

export default withRouter(ListItem);
