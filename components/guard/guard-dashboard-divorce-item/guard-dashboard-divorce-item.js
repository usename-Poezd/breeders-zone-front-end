import React from "react";
import Slider from "react-slick";
import {Col, Row} from "react-bootstrap";
import {formatDate} from "react-day-picker/moment";
import {Pipes} from "../../../services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck} from "@fortawesome/free-solid-svg-icons";

const GuardDashboardDivorceItem = (props) => {
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

    const hasSlider =  (props.sex_photos.length + props.masonry_photos.length + props.exit_photos.length) > 1;

    return (
        <div className="products-item feather-shadow d-flex align-items-center">
            <div className="products-item-img border-0">
                {
                    hasSlider ?
                        (
                            <Slider {...settings}>
                                {
                                    props.sex_photos.length > 0 ?
                                        <img src={ props.sex_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                                        : null
                                }
                                {
                                    props.masonry_photos.length > 0 ?
                                        <img src={ props.masonry_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                                        : null
                                }
                                {
                                    props.exit_photos.length > 0 ?
                                        <img src={ props.exit_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                                        : null
                                }
                            </Slider>
                        )
                        : null
                }

                {
                    props.sex_photos.length > 0 && !hasSlider ?
                        <img src={ props.sex_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                        : null
                }
                {
                    props.masonry_photos.length > 0 && !hasSlider ?
                        <img src={ props.masonry_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                        : null
                }
                {
                    props.exit_photos.length > 0 && !hasSlider ?
                        <img src={ props.exit_photos[0].img_src} alt={props.title} className="img-fluid my-2"/>
                        : null
                }

            </div>
            <div className="products-item-info">
                <h2 className="font-weight-bold">{props.title}</h2>
                <ul>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Категория:</h3>
                        <h3 className="info info-text">{props.kind.title_rus}</h3>
                    </li>
                    {
                        props.kind.has_subcategories && props.subcategory ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Подкатегория:</h3>
                                    <h3 className="info info-text">{props.subcategory.title}</h3>
                                </li>
                            )
                            : null
                    }
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Дата выхода:</h3>
                        <h3 className="info info-text">{formatDate(new Date(props.cb), 'DD/MM/YYYY', 'ru')}</h3>
                    </li>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Самец:</h3>
                        <div className="info morphs d-inline-block">
                            {
                                props.male.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title} {gene.title}</div>)
                            }
                        </div>
                    </li>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Самка:</h3>
                        <div className="info morphs d-inline-block">
                            {
                                props.female.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title} {gene.title}</div>)
                            }
                        </div>
                    </li>
                </ul>
                <div className="rate-block">
                    <div className="check" onClick={() => props.onVerify(props.id)}>
                        <FontAwesomeIcon icon={faCheck} size="lg"/>
                    </div>
                    <div className="report text-danger">
                        <FontAwesomeIcon icon={faBan} size="lg"/>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default GuardDashboardDivorceItem;
