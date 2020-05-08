import React, { Component } from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCar, faTruck, faHelicopter } from '@fortawesome/free-solid-svg-icons';
// import { faVk, faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons";
// import Slider from "react-slick";
//
// import instagramIcon from '../../../images/logos/inst_logo.svg';
// import withGetData from '../../hoc-helpers/with-get-data';
// import { Pipes } from '../../../services';
// import {Col, Row} from 'react-bootstrap';
// import ListItem from '../../list-item';
// import ShopTextContainer from '../../shop-text-container';
// import ShopMorphs from '../../shop-morphs';
// import {formatDate} from "react-day-picker/moment";

class ShopPage extends Component {
    state = {
        shop: {
            info: {},
            kinds: [],
            divorces: []
        },

        traits: [],

        reptiles: [],

        activeTab: 0
    };

    pipes = new Pipes();

    componentDidMount(){
        const { getShop, getShopReptiles } = this.props;
        const { shopName } = this.props.match.params;
        console.log( shopName );

        getShop(shopName)
            .then( data => this.setState({ shop: data}))
            // .then( () => this.updateTabContent() )
            // .then( () => this.upgradeGroupAndKindUrl() );

        // getShopReptiles(shopName)
        // getShopReptiles(shopName)
        //     .then( data => this.setState({ reptiles: data }));
    }

    onTab = (idx) => {
        const { activeTab } = this.state;

        if( activeTab !== idx ) this.setState( { activeTab: idx }, async () => {
            this.updateTabContent();
            this.upgradeGroupAndKindUrl();
        });
    };

    updateTabContent = () => {
        const { getShopTraits } = this.props;
        const { activeTab } = this.state;
        const { shopName } = this.props.match.params;
        const kindTitle = this.state.shop.kinds[activeTab].title_eng;


        getShopTraits(shopName, kindTitle)
            .then( data => this.setState({ traits: data }));
    }

    upgradeGroupAndKindUrl = () => {
        const { activeTab } = this.state;

        const kindUrl = this.pipes.toUrl(this.state.shop.kinds[activeTab].title_eng);
        const groupUrl = this.pipes.toUrl(this.state.shop.kinds[activeTab].group_name);
        const groupAndKindUrl = `/${groupUrl}/${kindUrl}`;

        this.setState({ groupAndKindUrl: groupAndKindUrl });
    }

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



        const { shop, traits, activeTab, groupAndKindUrl, reptiles } = this.state;
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
            logo_img_url
        } = shop.info;

        return (
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
                                <div className="country-flag country-flag-russia"></div>
                            </li>
                            {
                                local_delivery || regional_delivery || countrywide_delivery ?
                                    (
                                        <li className="shop-info-list-item">
                                            <h3 className="title">Доставка:</h3>
                                            <div className="dilivery info">
                                                {
                                                    local_delivery ?
                                                        (
                                                            <div className="dilivery-item">
                                                                <FontAwesomeIcon icon={faCar} size="lg"/>
                                                                <h3 className="info-text">Локальная</h3>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    regional_delivery ?
                                                        (
                                                            <div className="dilivery-item">
                                                                <FontAwesomeIcon icon={faTruck} size="lg"/>
                                                                <h3 className="info-text">Региональная</h3>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    countrywide_delivery ?
                                                        (
                                                            <div className="dilivery-item">
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
                                        <img src={logo_img_url} alt="shop logo" className="img-fluid"/>
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
                                                        <img src={instagramIcon} alt="instagram"/>
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

                <h2 className="shop-title">Разводы:</h2>
                <div className="feather-shadow divorces">
                    {
                        divorces.map( (item) => (
                            <div className="divorces-item">
                                <div className="divorces-item-info">
                                    <h2 className="font-weight-bold">{item.title}</h2>
                                    <ul>
                                        <li className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title-sex">Категория:</h3>
                                            <h3 className="info info-text">{item.kind.title_rus}</h3>
                                        </li>
                                        {
                                            item.kind.has_subcategories && item.subcategory ?
                                                (
                                                    <li className="product-card-info-item flex-row align-items-center">
                                                        <h3 className="title-sex">Подкатегория:</h3>
                                                        <h3 className="info info-text">{item.subcategory.title}</h3>
                                                    </li>
                                                )
                                                : null
                                        }
                                        <li className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title-sex">Дата выхлода:</h3>
                                            <h3 className="info info-text">{formatDate(new Date(item.cb), 'DD/MM/YYYY', 'ru')}</h3>
                                        </li>
                                        <li className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title-sex">Самец:</h3>
                                            <div className="info morphs d-inline-block">
                                                {
                                                    item.male.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${this.pipes.toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title} {gene.title}</div>)
                                                }
                                            </div>
                                        </li>
                                        <li className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title-sex">Самка:</h3>
                                            <div className="info morphs d-inline-block">
                                                {
                                                    item.female.map( ({gene, trait}) => <div key={`${gene}-${trait}-${name}`} className={`morph-indicator morph-${this.pipes.toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}>{trait.title} {gene.title}</div>)
                                                }
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="divorces-item-images">
                                    {
                                        item.sex_photos.length > 0 ?
                                            (
                                                <React.Fragment>
                                                    <h3 className="text-center divorces-item-photos-title">Фото спаривания:</h3>
                                                    <div className="d-flex justify-content-center">
                                                        {
                                                            item.sex_photos.map( (item) => <img src={item.img_src} alt={item.title} className="img-fluid"/>)
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            )
                                            : null
                                    }
                                    {
                                        item.masonry_photos.length > 0 ?
                                            (
                                                <React.Fragment>
                                                    <h3 className="text-center divorces-item-photos-title">Фото кладки:</h3>
                                                    <div className="d-flex justify-content-center">
                                                        {
                                                            item.masonry_photos.map( (item) => <img src={item.img_src} alt={item.title} className="img-fluid"/>)
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            )
                                            : null
                                    }
                                    {
                                        item.exit_photos.length > 0 ?
                                            (
                                                <React.Fragment>
                                                    <h3 className="text-center divorces-item-photos-title">Фото выхода:</h3>
                                                    <div className="d-flex justify-content-center">
                                                        {
                                                            item.exit_photos.map( (item) => <img src={item.img_src} alt={item.title} className="img-fluid"/>)
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            )
                                            : null
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

                <h2 className="shop-title category-title">Категории:</h2>

                {
                    kinds > 4 ?
                        (
                            <Slider {...sliderOptions} className="category">
                                {
                                    kinds.map(({ title_rus, title_eng, group }) => (
                                        <Link to={`/${this.pipes.toUrl(group + '/' + title_eng)}?shop=${this.pipes.toUrl(company_name)}`} className="category-card">
                                            <img src="https://sun9-66.userapi.com/c855228/v855228689/1965b2/tHxS30gqRqI.jpg" className="img-fluid" alt="main"/>
                                            <div className="category-card-body">
                                                <h3>{title_rus}</h3>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </Slider>
                        ) :
                        (
                            <Row className="justify-content-center category">
                                {
                                    kinds.map(({ title_rus, title_eng, group }) => (
                                        <Col as={Link} to={`/${this.pipes.toUrl(group + '/' + title_eng)}?shop=${this.pipes.toUrl(company_name)}`} xs={12} sm={6} md={4} lg={3}>
                                            <div className="category-card">
                                                <img src="https://sun9-66.userapi.com/c855228/v855228689/1965b2/tHxS30gqRqI.jpg" className="img-fluid" alt="main"/>
                                                <div className="category-card-body">
                                                    <h3>{title_rus}</h3>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>
                        )
                }

                {/*<ShopMorphs*/}
                {/*    kinds={kinds}*/}
                {/*    traits={traits}*/}
                {/*    groupAndKindUrl={groupAndKindUrl}*/}
                {/*    shopName={name}*/}
                {/*    activeTab={activeTab}*/}
                {/*    onTab={this.onTab}*/}
                {/*/>*/}

                {/*<h2 className="shop-title">Все товары:</h2>*/}
                {/*<Row className="shop-items justify-content-center">*/}
                {/*    {*/}
                {/*        reptiles.map( ({ id, title, price, sex, cb, shop }) => (*/}
                {/*            <ListItem id={id} title={title} price={price} sex={sex} cb={cb} shop={shop}/>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</Row>*/}
            </div>
        );
    }
}

const mapMethodsToProps = (getData) => {
    return {
        getShop: getData.getShop,
        getShopTraits: getData.getShopTraits,
        getShopReptiles: getData.getShopReptiles
    }
}

export default ShopPage;
