import React from "react";
import {Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Pipes} from "../../services";
import {deleteShopDivorce} from "../../actions";
import {connect} from 'react-redux';
import Link from "next/link";
import {compareMorph} from "../../utils";
import moment from "moment";


const ShopDivorcesItem = (props) => {

    const {toTraitClass} = new Pipes();

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true
    };

    return (
        <div className="products-item feather-shadow d-flex">
            <Link href="/divorces/[id]" as={`/divorces/${props.id}`}>
                <a className={"products-item-img border-0" + (!props.hasControls ? " w-25" : '')}>
                    {
                        props.exit_photos.length > 0 ?
                            <img src={ props.exit_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                            : null
                    }
                </a>
            </Link>

            <div className={"products-item-info" + (!props.hasControls ? " w-75 border-right-0" : '')}>
                <Link href="/divorces/[id]" as={`/divorces/${props.id}`}>
                    <a className="divorces">
                        <h2 className="font-weight-bold">{props.title}</h2>
                    </a>
                </Link>
                <Row as="ul">
                    <Col xs={12} md={6} className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Категория:</h3>
                        <h3 className="info info-text">{props.kind.title_rus}</h3>
                    </Col>
                    {
                        props.kind.has_subcategories && props.subcategory ?
                            (
                                <Col xs={12} md={6} className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Подкатегория:</h3>
                                    <h3 className="info info-text">{props.subcategory.title}</h3>
                                </Col>
                            )
                            : null
                    }
                    <Col xs={12} className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Дата выхода:</h3>
                        <h3 className="info info-text">{moment(props.cb).format('DD.MM.YYYY')}</h3>
                    </Col>
                    {
                        props.male.length > 0 ?
                            <Col xs={12} className="product-card-info-item flex-row align-items-center">
                                <h3 className="title-sex">Самец:</h3>
                                <div className="info morphs d-inline-block">
                                    {
                                        props.male.map( ({gene, trait}) => <div key={`${gene}-${trait}-${props.title}`} className={`morph-indicator morph-${gene.type}-${toTraitClass(trait.trait_group ? trait.trait_group.label : trait.title)} d-inline-block`}>{compareMorph(trait.title, gene.title)}</div>)
                                    }
                                </div>
                            </Col>
                            : null
                    }
                    {
                        props.female.length > 0 ?
                            <Col xs={12} className="product-card-info-item flex-row align-items-center">
                                <h3 className="title-sex">Самка:</h3>
                                <div className="info morphs d-inline-block">
                                    {
                                        props.female.map( ({gene, trait}) => <div key={`${gene}-${trait}-${props.title}`} className={`morph-indicator morph-${gene.type}-${toTraitClass(trait.trait_group ? trait.trait_group.label : trait.title)} d-inline-block`}>{compareMorph(trait.title, gene.title)}</div>)
                                    }
                                </div>
                            </Col>
                            : null
                    }
                </Row>
            </div>
            {
                props.hasControls ?
                    (
                        <div className="products-item-controls-container d-flex flex-column flex-sm-row flex-md-column justify-content-center align-items-center">
                            <div className="products-item-controls d-flex align-items-start justify-content-center">
                                <Link href="/profile/divorces/edit/[id]" as={`/profile/divorces/edit/${props.id}`}>
                                    <a className="products-item-controls-item">
                                        <FontAwesomeIcon icon={faPen}/>
                                    </a>
                                </Link>
                                <div
                                    className="products-item-controls-item times"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        props.deleteShopDivorce(props.id)
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes}/>
                                </div>
                            </div>
                        </div>
                    )
                    : null
            }
        </div>
    )
};

export default connect(null, {deleteShopDivorce})(ShopDivorcesItem);
