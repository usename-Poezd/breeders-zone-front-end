import * as React from "react";
import {FC} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faVk, faYoutube} from "@fortawesome/free-brands-svg-icons";
import ShopTextContainer from "../../../components/shop-text-container";
import Slider from "react-slick";
import {Col, Container, Row} from 'react-bootstrap';
import Link from "next/link";
import ShopDivorcesItem from "../../../components/shop-divorces-item";
import {ShopMorphs} from "../ShopMorphs";
import {setActiveKind} from "../../../redux/Kinds";
import {connect} from "react-redux";
import Head from "next/head";
import LazyImg from "../../../components/lazy-img";
import Error from "../../../pages/_error";
import {toUrl} from "../../../utils";
import {IShopDispatchProps, ShopPropsType} from "./types";
import {ProductList} from "../../../components/ProductList";

const ShopComponent: FC<ShopPropsType> = (props) => {
    const { shop, setActiveKind , statusCode} = props;

    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>
    }

    const { kinds, divorces } = shop;

    const {
        company_name,
        owner,
        website,
        vk,
        facebook,
        instagram,
        youtube,
        description,
        policity,
        location,
        local_delivery,
        regional_delivery,
        countrywide_delivery,
        logo_img_url,
        country
    } = shop;

    const sliderOptions = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,

        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    };

    return (
        <Container>
            <Head>
                <title>{company_name} | Breeders Zone</title>
            </Head>
            <div className="shop">
                <div className="shop-container d-flex flex-column flex-md-row justify-content-between">
                    <div className="shop-info">
                        <h2 className="shop-name">{company_name}</h2>
                        <ul className="shop-info-list">
                            <li className="shop-info-list-item">
                                <h3 className="title">Владелец:</h3>
                                <h3 className="info info-text">{owner}</h3>
                            </li>
                            <li className="shop-info-list-item">
                                <h3 className="title">Локация:</h3>
                                <h3 className="info info-text">{location}</h3>
                                <div className={`country-flag flag flag-${country?.iso_3166_2.toLowerCase()}`}></div>
                            </li>
                            {
                                local_delivery || regional_delivery || countrywide_delivery ?
                                    (
                                        <li className="shop-info-list-item">
                                            <h3 className="title">Доставка:</h3>
                                            <div className="delivery info">
                                                {
                                                    local_delivery ?
                                                        (
                                                            <div className="delivery-item">
                                                                <FontAwesomeIcon icon={faCar} size="lg"/>
                                                                <h3 className="info-text">Локальная</h3>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    regional_delivery ?
                                                        (
                                                            <div className="delivery-item">
                                                                <FontAwesomeIcon icon={faTruck} size="lg"/>
                                                                <h3 className="info-text">Региональная</h3>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    countrywide_delivery ?
                                                        (
                                                            <div className="delivery-item">
                                                                <FontAwesomeIcon icon={faHelicopter} size="lg"/>
                                                                <h3 className="info-text">Международная</h3>
                                                            </div>
                                                        ) : null
                                                }
                                            </div>
                                        </li>
                                    )
                                    : null
                            }
                        </ul>
                    </div>
                    <div className="shop-brand-and-contact">
                        {
                            logo_img_url ?
                                (
                                    <div className="shop-brand mb-1">
                                        <LazyImg src={logo_img_url} alt="shop logo" className="img-fluid"/>
                                    </div>
                                )
                                : null
                        }
                        {
                            vk || facebook || instagram || youtube || website ?
                                (
                                    <div className="shop-contact">
                                        <h3 className="shop-contact-title">Контакты:</h3>
                                        <div className={`shop-contact-social ${vk && instagram && facebook && youtube && 'justify-content-between'}`}>
                                            {
                                                vk ? (
                                                    <a className="social-item" target="_blank" href={vk}>
                                                        <FontAwesomeIcon icon={faVk} size="lg" className="social-vk"/>
                                                    </a>
                                                ) : null
                                            }

                                            {
                                                instagram ? (
                                                    <a className={`social-item ${!vk || !instagram || !facebook || !youtube ? 'ml--10' : ''}`} target="_blank" href={instagram}>
                                                        <img src="/images/logos/inst_logo.svg" alt="instagram"/>
                                                    </a>
                                                ) : null
                                            }

                                            {
                                                facebook ? (
                                                    <a className={`social-item ${!vk || !instagram || !facebook || !youtube ? 'ml--10' : ''}`} target="_blank" href={facebook}>
                                                        <FontAwesomeIcon icon={faFacebookF} size="lg" className="social-facebook"/>
                                                    </a>
                                                ) : null
                                            }

                                            {
                                                youtube ? (
                                                    <a className={`social-item ${!vk || !instagram || !facebook || !youtube ? 'ml--10' : ''}`} target="_blank" href={youtube}>
                                                        <FontAwesomeIcon icon={faYoutube} size="2x" className="social-youtube"/>
                                                    </a>
                                                ) : null
                                            }


                                        </div>

                                        {
                                            website ? (
                                                <a className="shop-website h3" target="_blank" href={website}>
                                                    {website}
                                                </a>
                                            ) : null
                                        }

                                    </div>
                                )
                                : null
                        }
                    </div>
                </div>

                <ShopTextContainer text={description} title="Описание"/>
                <ShopTextContainer text={policity} title="Политика магазина"/>

                {
                    divorces && divorces.length > 0 ?
                        (
                            <React.Fragment>
                                <h2 className="shop-title">Разведения:</h2>
                                <div className="divorces">
                                    {
                                        divorces.map( (item) => <ShopDivorcesItem key={`divorce-${item.id}`} {...item}/>)
                                    }
                                </div>
                            </React.Fragment>
                        ) : null
                }

                {
                    divorces && divorces.length > 0 &&
                    <Row className="shop-items justify-content-center">
                        <Col xs={12}>
                            <Link href={"/divorces?shop=" + company_name}>
                                <a className="d-block feather-shadow text-center h3 btn-second-bn p--15">
                                    Показать все разведения от {company_name}
                                </a>
                            </Link>
                        </Col>
                    </Row>
                }

                {
                    kinds && kinds.length > 0 ?
                        (
                            <React.Fragment>
                                <h2 className="shop-title category-title">Категории:</h2>

                                {
                                    kinds.length > 4 ?
                                        (
                                            <Slider {...sliderOptions} className="category">
                                                {
                                                    kinds.map((item, idx) => (
                                                        <div key={"category-" + idx}>
                                                            <Link href="/[group]/[kind]" as={`/${item.group}/${toUrl( item.title_eng)}?shop=${company_name}`}>
                                                                <a
                                                                    className="home-card"
                                                                    onClick={() => setActiveKind(item)}
                                                                >
                                                                    <LazyImg src={item.logo_square} className="home-card-img img-fluid" alt="main"/>
                                                                    <div className="home-card-info">
                                                                        <h3>{item.title_rus}</h3>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </Slider>
                                        ) :
                                        (
                                            <Row className="justify-content-center category">
                                                {
                                                    kinds.map((item, idx) => (
                                                        <Link key={"category-" + idx} href="/[group]/[kind]" as={`/${item.group}/${toUrl( item.title_eng)}?shop=${company_name}`}>
                                                            <a
                                                                className={"col-12 col-sm-6 col-md-4 col-lg-3" + (idx + 1 !== kinds.length ? ' mb-3' : '')}
                                                                onClick={() => setActiveKind(item)}
                                                            >
                                                                <div className="d-flex flex-column justify-content-center home-card">
                                                                    <div className="home-card-img">
                                                                        <div className="img-container">
                                                                            <LazyImg src={item.logo_square ? item.logo_square : '/images/icons/error-snake.svg'} alt={item.title_rus} className="img-fluid"/>
                                                                        </div>
                                                                    </div>

                                                                    <div className="category-card-body">
                                                                        <h3>{item.title_rus}</h3>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    ))
                                                }
                                            </Row>
                                        )
                                }
                            </React.Fragment>
                        ) : null
                }

                {
                    kinds && kinds.length > 0 ?
                        <ShopMorphs
                            kinds={kinds}
                            shopName={company_name}
                        />
                        : null
                }

                {
                    shop.products && shop.products.length > 0 ?
                        <React.Fragment>
                            <h2 className="shop-title">Все товары:</h2>
                            <Row className="shop-items justify-content-center">
                                <ProductList products={shop.products} isFilter={false} hasRow={false}/>
                                <Col xs={12}>
                                    <Link href={"/reptiles?shop=" + company_name}>
                                        <a className="d-block feather-shadow text-center h3 btn-second-bn p--15">
                                            Показать всех животных от {company_name}
                                        </a>
                                    </Link>
                                </Col>
                            </Row>
                        </React.Fragment>
                        : null
                }
            </div>
        </Container>
    );
};

const Shop = connect<null, IShopDispatchProps>(null, {setActiveKind})(ShopComponent);

export {
    Shop
}