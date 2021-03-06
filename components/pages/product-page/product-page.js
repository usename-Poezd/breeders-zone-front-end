import React, {Component} from "react";
import {Pipes} from "../../../services";
import {Col, Container, Modal, Row} from "react-bootstrap";
import Spinner from "../../../components/spinner";
import Carousel, {Modal as ImageModal, ModalGateway} from "react-images";
import Chat from "../../../components/chat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faGenderless, faMars, faRubleSign, faVenus} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import {withErrorBoundry, withGetData} from "../../../components/hoc-helpers";
import {withRouter} from "next/router";
import Link from "next/link";
import {connect} from "react-redux";
import Head from "next/head";
import comparer from "../../../utils/comparer-by-id";
import LazyImg from "../../../components/lazy-img";
import ReportModal from "../../../components/report-modal/report-modal";
import {setChatAct, setChatProduct, setReportModalProductId, setReportModalShow} from "../../../actions";
import {compareMorph, currencyOptions} from "../../../utils";
import moment from "moment";
import currency from "currency.js";
import getSymbolFromCurrency from "currency-symbol-map";

class ProductPage extends Component  {

    state = {
        productRequest: false,
        sendMessageModal: false,
        mainImg: this.props.product.product_images[0],
        modalImage: false,
        isVerify: false
    };
    pipes = new Pipes();

    componentDidMount() {
        this.checkVerify();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profile.user !== this.props.profile.user) {
            this.checkVerify();
        }
    }

    checkVerify = () => {
        const {product, profile} = this.props;
        if (product.guards.find((item) => item.id === profile.user.id)) {
            this.setState({isVerify: true});
        }
    };

    sendMessage = () => {
        const {setChatAct, setChatProduct, product} = this.props;
        setChatAct('new');
        setChatProduct(product);
        this.setState({
            sendMessageModal: true
        });
    };

    modalClose = () => {
        const { router, pathname, search } = this.props;
        const newQuery = qs.parse(search.replace('?', ''));
        if (newQuery.act) {
            delete newQuery.act;
        }
        if (newQuery.room) {
            delete newQuery.room
        }

        router.push(router.pathname, pathname + '?' + qs.stringify(newQuery));
        this.setState({sendMessageModal: false});
    };

    render(){
        const { productRequest, sendMessageModal, mainImg, modalImage, isVerify} = this.state;
        const {profile, product, verifyProduct, setReportModalShow, setReportModalProductId} = this.props;
        const {
            id,
            article,
            name,
            price,
            ask_price,
            sex,
            group: groupSex,
            cb,
            morphs,
            guards,
            user: {
                company_name,
                location,
                logo_img_url,
                country
            },
            age,
            kind: {title_rus, title_eng, guards: kindGuards, id: kindId, only_text},
            locality,
            description,
            product_images,
            subcategory
        } = product;

        const sliderOptions = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
        };

        const {kind, group} = this.props.router.query;

        if (productRequest) {
            return (
                <Row className="product-card">
                    <Col xs={12} className="text-center">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        const images = product_images.map((item) => ({
            caption: name,
            source: item.img_src
        }));

        return (
            <Container as="section">
                <Head>
                    <title>{name} — купить в интернет-магазине Breeders Zone</title>
                </Head>
                <Row className="product-card">

                    <ReportModal/>
                    <ModalGateway>
                        {
                            modalImage ?
                                (
                                    <ImageModal onClose={() => this.setState({ modalImage: false })}>
                                        <Carousel views={images} currentIndex={images.findIndex((item) => item.source === mainImg.img_src)}/>
                                    </ImageModal>
                                )
                                : null
                        }
                    </ModalGateway>



                    <Modal show={sendMessageModal} onHide={this.modalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Сообщения</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Chat newUser={this.props.product.user}/>
                        </Modal.Body>
                    </Modal>


                    <Col xs={12} className="text-center position-relative">
                        <h1 className="product-card-title h2">{name}</h1>
                        {
                            profile.user.is_guard && profile.user.guardians_kinds.find((item) => item.id === kindId) ?
                                <div className="rate-block ml-auto" style={{
                                    position: 'absolute',
                                    left: 'auto',
                                    right: 20
                                }}>
                                    <div
                                        className={"check" + (isVerify ? ' active' : '')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isVerify) {
                                                this.setState({isVerify: true});
                                                verifyProduct(id)
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faCheck} size="lg"/>
                                    </div>
                                    {
                                        !isVerify ?
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
                    </Col>
                    <Col xs={12} lg={6} className="product-card-container">
                        <div className="product-card-body feather-shadow">
                            <ul className="product-card-info">
                                <li className="product-card-info-item">
                                    <div className="title text-base">{article ? 'Уникальный идентификатор' : 'Номер в системе'}:</div>
                                    <div className="info info-text text-base">{article ? article : id}</div>
                                </li>
                                <li className="product-card-info-item">
                                    <div className="title text-base">Категория:</div>
                                    <div className="info info-text text-base">
                                        {title_rus} ({title_eng})
                                    </div>
                                </li>
                                {
                                    subcategory !== null ?
                                        (
                                            <li className="product-card-info-item">
                                                <div className="title text-base">Подкатегория:</div>
                                                <Link href="/[group]/[kind]/subcategories/[subcategoryTitle]" as={`/${group}/${kind}/subcategories/${this.pipes.toUrl(subcategory.title)}`}>
                                                    <a className="subcategory-title">
                                                        <div className="info info-text text-base">{subcategory.title}</div>
                                                    </a>
                                                </Link>
                                            </li>
                                        )
                                        : null
                                }
                                {
                                    !only_text &&
                                    <li className="product-card-info-item flex-row align-items-center">
                                        <div className={"text-base title" + (sex !== null ? ' title-sex' : '')}>Пол:</div>
                                        {
                                            groupSex !== null &&
                                            <div className="info d-flex align-items-center">
                                                <span className="ml-0 mr-1">{groupSex.male}</span>
                                                <FontAwesomeIcon icon={faMars} size="lg" className="sex-male"/>
                                                <span className="ml-0">.</span>
                                                <span className="ml-0 mr-1">{groupSex.female}</span>
                                                <FontAwesomeIcon icon={faVenus} size="lg" className="sex-female"/>
                                            </div>
                                        }
                                        {
                                            sex === null && groupSex === null &&
                                            <div className="info info-text text-base">Не определён</div>
                                        }
                                        {
                                            sex !== null && groupSex === null &&
                                            <div className="info d-flex align-items-center">
                                                <FontAwesomeIcon icon={ sex ? faMars : faVenus } size="2x" className={`sex-` + (sex ? 'male' : 'female')} />&nbsp;
                                                {sex ? "Самец (Male)" : "Самка (Female)"}
                                            </div>
                                        }

                                    </li>
                                }
                                {
                                    morphs.length > 0 ?
                                        (
                                            <li className="product-card-info-item flex-row align-items-center">
                                                <div className="title title-sex text-base">Морфы:</div>
                                                <div className="info morphs">
                                                    {
                                                        morphs.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle, trait_group}}, idx) => (
                                                            <Link key={"morph-" + idx} href="/[group]/[kind]/morphs/[morph]" as={`/${group}/${kind}/morphs/${this.pipes.toUrl(trait_group ? trait_group.label : traitTitle)}-${this.pipes.toUrl(geneTitle)}`}>
                                                                <a className={`morph-indicator morph-${type}-${this.pipes.toUrl(trait_group ? trait_group.label : traitTitle)}`}>
                                                                    {compareMorph(traitTitle, geneTitle)}
                                                                </a>
                                                            </Link>
                                                        ))
                                                    }
                                                </div>
                                            </li>
                                        )
                                        : null
                                }
                                {
                                    locality ?
                                        (
                                            <li className="product-card-info-item">
                                                <div className="title text-base">Локалитет:</div>
                                                <div className="info morphs">
                                                    <Link href="/[group]/[kind]" as={`/${group}/${kind}?locality=${locality.id}`} >
                                                        <a className="morph-indicator morph-other-normal">
                                                            {locality.title}
                                                        </a>
                                                    </Link>
                                                </div>
                                            </li>
                                        )
                                        : null
                                }
                                {
                                    !only_text &&
                                    (
                                        <React.Fragment>
                                            <li className="product-card-info-item">
                                                <div className="title text-base">Дата рождения:</div>
                                                <div className="info info-text text-base">{moment(cb).format('DD.MM.YYYY')}</div>
                                            </li>
                                            <li className="product-card-info-item">
                                                <div className="title text-base">Возраст:</div>
                                                <div className="info info-text text-base">{age.title}</div>
                                            </li>
                                            {
                                                guards.length > 0 ?
                                                    (
                                                        <li className="product-card-info-item align-items-sm-center flex-sm-row">
                                                            <div className="title text-base">Рейтинг у хранителей:</div>
                                                            <div className="info rate d-flex align-items-center">
                                                                <div className="rating">
                                                                    {
                                                                        guards.map( () => <div className="rating-star"></div>)
                                                                    }
                                                                    {
                                                                        comparer(kindGuards, guards).map( () => <div className="rating-star empty"></div>)
                                                                    }
                                                                </div>
                                                                <span className="rating-count">({guards.length}/{kindGuards.length})</span>
                                                            </div>
                                                        </li>
                                                    )
                                                    : null
                                            }
                                        </React.Fragment>
                                    )
                                }

                                <li className="product-card-info-item shop flex-column">
                                    <div className="shop-title mt-0 d-flex">
                                        <div className="title text-base">Производитель:</div>
                                        <Link href="/shops/[shopName]" as={'/shops/' + company_name}>
                                            <a>
                                                <div className="info info-text text-base">{company_name}</div>
                                            </a>
                                        </Link>
                                    </div>
                                    {
                                        logo_img_url ?
                                            (
                                                <div className="shop-img text-center">
                                                    <LazyImg src={logo_img_url} className="img-fluid"/>
                                                </div>
                                            )
                                            : null
                                    }
                                </li>
                                <li className="product-card-info-item flex-row align-items-center">
                                    <div className="title text-base">Локация:</div>
                                    <div className="info info-text text-base">{location}</div>
                                    <div className={`country-flag flag flag-${country?.iso_3166_2.toLowerCase()}`}></div>
                                </li>
                            </ul>
                        </div>

                        <div className="in-cart-container feather-shadow">
                            <div className="price-container">
                                <div className={`h2 price mr-sm-4 mr-0 ${ask_price && 'text-center w-100'}`}>
                                    {
                                        !ask_price ?
                                            `${currency(price.find((item) => item.type === 'main').amount, currencyOptions).format()} ${getSymbolFromCurrency(price.find((item) => item.type === 'main').currency)}`
                                            : 'Цена по запросу'
                                    }

                                </div>
                                {
                                    !ask_price &&
                                        <div>
                                        <p
                                            className="text-center"
                                            style={{
                                                fontSize: 12
                                            }}
                                        >
                                            Эквивалент по курсу <a href="https://www.cbr.ru/" target="_blank">ЦБ РФ</a>
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            {
                                                price.map((item) => {
                                                    if (item.type !== 'main') {
                                                        return <span
                                                            className={"price-small mb--5 font-weight-bold" + (item.currency === 'USD' ? ' color-main' : ' ml-2 text-primary')}
                                                        >
                                                    {
                                                        item.currency === 'USD' ?
                                                            `${currency(item.amount, {...currencyOptions, precision: 2}).format()} US${getSymbolFromCurrency(item.currency)}`
                                                            : `${currency(item.amount, {...currencyOptions, precision: 2}).format()}${getSymbolFromCurrency(item.currency)}`
                                                    }
                                                </span>
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="text-base btn btn-main btn-in-cart m-0" onClick={() => this.sendMessage()}>
                                Написать о покупке
                            </div>
                            {/*<div className="btn-second-bn btn-in-cart feather-shadow">*/}
                            {/*    <h3>Забронировать</h3>*/}
                            {/*</div>*/}
                        </div>
                        {
                            !ask_price &&
                                <p className="text-center" style={{
                                    fontSize: 11
                                }}>*Оплата за товар производится в рублях</p>
                        }
                    </Col>
                    <Col xs={12} lg={6}>
                        <div className="product-card-img">
                            {
                                mainImg ?
                                    (
                                        <div className="img-main-container" onClick={() => this.setState({modalImage: true})}>
                                            <LazyImg src={mainImg.img_src} className="img-fluid img-main" alt={name}/>
                                        </div>
                                    )
                                    : null
                            }
                            <Slider {...sliderOptions}>
                                {
                                    product_images.map( (item) => (
                                        <div
                                            key={item.img_src}
                                            onClick={() => this.setState({mainImg: item})}
                                            className={"slider-item" + (item.id === mainImg.id ? ' selected' : '')}
                                        >
                                            <LazyImg src={item.img_src} className="img-fluid" alt={name}/>
                                        </div>
                                    ))
                                }
                            </Slider>
                        </div>

                        {
                            description ?
                                (
                                    <div className="product-card-description feather-shadow">
                                        <p>
                                            <span className="desc">Описание:</span> {description}
                                        </p>
                                    </div>
                                ) : null
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}
const mapMethodsToProps = ({verifyProduct}) => ({
    verifyProduct
});

const mapStateToProps = ({router: {location: {pathname, search}}, profile}) => ({
    pathname,
    search,
    profile
});


export default connect(mapStateToProps, {setReportModalShow, setReportModalProductId, setChatAct, setChatProduct})(
    withRouter(
        withGetData(
            withErrorBoundry(ProductPage),
            mapMethodsToProps
        )
    )
);
