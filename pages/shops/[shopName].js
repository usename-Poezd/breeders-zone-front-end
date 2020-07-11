import React, {Component} from "react";
import {DataService, Pipes} from "../../services";
import {withGetData} from "../../components/hoc-helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faVk, faYoutube} from "@fortawesome/free-brands-svg-icons";
import ShopTextContainer from "../../components/shop-text-container";
import {formatDate} from "react-day-picker/moment";
import Slider from "react-slick";
import {Col, Container, Row} from 'react-bootstrap';
import {withRouter} from "next/router";
import Link from "next/link";
import ShopDivorcesItem from "../../components/shop-divorces-item";
import ShopMorphs from "../../components/shop-morphs";
import {setActiveKind} from "../../actions";
import {connect} from "react-redux";
import Head from "next/head";
import TraitItem from "../../components/trait-item/trait-item";
import LazyImg from "../../components/lazy-img";
import Error from "../_error";

class ShopPage extends Component {
    state = {
        morphs: [],
        loadingMorphs: false,
        activeTab: 0
    };

    pipes = new Pipes();

    componentDidMount(){
        if (typeof this.props.shop !== 'undefined') {
            this.updateTabContent();
            this.upgradeGroupAndKindUrl();
        }
    }

    onTab = (idx) => {
        const { activeTab } = this.state;

        if( activeTab !== idx ) this.setState( { activeTab: idx }, async () => {
            this.updateTabContent();
            this.upgradeGroupAndKindUrl();
        });
    };

    updateTabContent = () => {
        const { getShopMorphs, router, shop } = this.props;
        const { activeTab } = this.state;
        const { shopName } = router.query;
        const kindId = shop.kinds[activeTab].id;

        this.setState({loadingMorphs: true});
        getShopMorphs({
            shop: shopName,
            kindId
        })
            .then( data => this.setState({ morphs: data, loadingMorphs: false }));
    };

    upgradeGroupAndKindUrl = () => {
        const { shop } = this.props;
        const { activeTab } = this.state;

        const kindUrl = this.pipes.toUrl(shop.kinds[activeTab].title_eng);
        const groupUrl = this.pipes.toUrl(shop.kinds[activeTab].group);
        const groupAndKindUrl = `/${groupUrl}/${kindUrl}`;

        this.setState({ groupAndKindUrl: groupAndKindUrl });
    };

    render() {

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



        const { morphs, activeTab, groupAndKindUrl, loadingMorphs } = this.state;
        const { shop, setActiveKind , statusCode} = this.props;

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
        } = shop.info;

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
                                                                    <h3 className="info-text">По всей стране</h3>
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
                                            <div className="shop-contact-social">
                                                {
                                                    vk ? (
                                                        <a className="social-item" href={vk}>
                                                            <FontAwesomeIcon icon={faVk} size="lg" className="social-vk"/>
                                                        </a>
                                                    ) : null
                                                }

                                                {
                                                    instagram ? (
                                                        <a className="social-item" href={instagram}>
                                                            <img src="/images/logos/inst_logo.svg" alt="instagram"/>
                                                        </a>
                                                    ) : null
                                                }

                                                {
                                                    facebook ? (
                                                        <a className="social-item" href={facebook}>
                                                            <FontAwesomeIcon icon={faFacebookF} size="lg" className="social-facebook"/>
                                                        </a>
                                                    ) : null
                                                }

                                                {
                                                    youtube ? (
                                                        <a className="social-item" href={youtube}>
                                                            <FontAwesomeIcon icon={faYoutube} size="2x" className="social-youtube"/>
                                                        </a>
                                                    ) : null
                                                }


                                            </div>

                                            {
                                                website ? (
                                                    <a className="shop-website h3" href={website}>
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
                        divorces.length > 0 ?
                            (
                                <React.Fragment>
                                    <h2 className="shop-title">Разводы:</h2>
                                    <div className="divorces">
                                        {
                                            divorces.map( (item) => <ShopDivorcesItem key={`divorce-${item.id}`} {...item}/>)
                                        }
                                    </div>
                                </React.Fragment>
                            ) : null
                    }

                    {
                        kinds.length > 0 ?
                            (
                                <React.Fragment>
                                    <h2 className="shop-title category-title">Категории:</h2>

                                    {
                                        kinds.length > 4 ?
                                            (
                                                <Slider {...sliderOptions} className="category">
                                                    {
                                                        kinds.map((item) => (
                                                            <Link href="/[group]/[kind]" as={`/${this.pipes.toUrl(item.group + '/' + item.title_eng)}?shop=${this.pipes.toUrl(company_name)}`}>
                                                                <a
                                                                    className="category-card"
                                                                    onClick={() => setActiveKind(item)}
                                                                >
                                                                    <LazyImg src={item.logo_square} className="img-fluid" alt="main"/>
                                                                    <div className="category-card-body">
                                                                        <h3>{item.title_rus}</h3>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        ))
                                                    }
                                                </Slider>
                                            ) :
                                            (
                                                <Row className="justify-content-center category">
                                                    {
                                                        kinds.map((item, idx) => (
                                                            <Link key={"category-" + idx} href="/[group]/[kind]" as={`/${this.pipes.toUrl(item.group + '/' + item.title_eng)}?shop=${this.pipes.toUrl(company_name)}`}>
                                                                <a
                                                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                                                    onClick={() => setActiveKind(item)}
                                                                >
                                                                    <div className="d-flex flex-column justify-content-center home-card">
                                                                        <div className="home-card-img">
                                                                            <div className="img-container">
                                                                                <LazyImg src={item.logo_square ? item.logo_square : '/images/error-snake.svg'} alt={item.title_rus} className="img-fluid"/>
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

                    <ShopMorphs
                        kinds={kinds}
                        morphs={morphs}
                        groupAndKindUrl={groupAndKindUrl}
                        shopName={company_name}
                        activeTab={activeTab}
                        onTab={this.onTab}
                        loadingMorphs={loadingMorphs}
                    />

                    <h2 className="shop-title">Все товары:</h2>
                    <Row className="shop-items justify-content-center">
                        {
                            shop.products.map( (item) => (
                                <TraitItem key={item.id} {...item}/>
                            ))
                        }
                        <Col xs={12}>
                            <Link href={"/reptiles?shop=" + company_name}>
                                <a>
                                    <h3 className="my-3 p-3 feather-shadow text-center">Показать всех животный от {company_name}</h3>
                                </a>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const {shopName} = await ctx.query;
        const shop = await dataService.getShop(shopName);


        return {
            props: {
                statusCode: 200,
                shop
            }
        }
    } catch (error) {
        ctx.res.statusCode = error.response.status;
        return {
            props: {
                statusCode: error.response.status
            }
        };
    }
};

const mapMethodsToProps = (getData) => {
    return {
        getShop: getData.getShop,
        getShopMorphs: getData.getShopMorphs,
        getShopReptiles: getData.getShopReptiles
    }
};

export default connect(null, {setActiveKind})(
    withRouter(
        withGetData(ShopPage, mapMethodsToProps)
    ))
;
