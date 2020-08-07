import React, {Component} from "react";
import {DataService, Pipes} from "../../../services";
import {Col, Container, Modal, Row} from "react-bootstrap";
import Spinner from "../../../components/spinner";
import Carousel, {Modal as ImageModal, ModalGateway} from "react-images";
import Chat from "../../../components/chat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faMars, faRubleSign, faVenus} from "@fortawesome/free-solid-svg-icons";
import {formatDate} from "react-day-picker/moment";
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
import {compareMorph} from "../../../utils";

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
            sex,
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
            kind: {title_rus, title_eng, guards: kindGuards, id: kindId},
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
            <Container>
                <Head>
                    <title>{name}</title>
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
                        <h2 className="product-card-title"><span className="morph">{name}</span></h2>
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
                                {
                                    article ?
                                        <li className="product-card-info-item">
                                            <h3 className="title">Уникальный индификатор:</h3>
                                            <h3 className="info info-text">
                                                {article}
                                            </h3>
                                        </li>
                                        : null
                                }
                                <li className="product-card-info-item">
                                    <h3 className="title">Категория:</h3>
                                    <h3 className="info info-text">
                                        {title_rus}<br/>
                                        ({title_eng})
                                    </h3>
                                </li>
                                {
                                    subcategory !== null ?
                                        (
                                            <li className="product-card-info-item">
                                                <h3 className="title">Подкатегория:</h3>
                                                <Link href="/[group]/[kind]/subcategories/[subcategoryTitle]" as={`/${group}/${kind}/subcategories/${this.pipes.toUrl(subcategory.title)}`}>
                                                    <a className="subcategory-title">
                                                        <h3 className="info info-text">{subcategory.title}</h3>
                                                    </a>
                                                </Link>
                                            </li>
                                        )
                                        : null
                                }
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title title-sex">Пол:</h3>
                                    <FontAwesomeIcon icon={ sex ? faMars : faVenus } size="2x" className={`info sex-` + (sex ? 'male' : 'female')} />
                                </li>
                                {
                                    morphs.length > 0 ?
                                        (
                                            <li className="product-card-info-item flex-row align-items-center">
                                                <h3 className="title title-sex">Морфы:</h3>
                                                <div className="info morphs">
                                                    {
                                                        morphs.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle}}, idx) => (
                                                            <Link key={"morph-" + idx} href="/[group]/[kind]/morphs/[morph]" as={`/${group}/${kind}/morphs/${this.pipes.toUrl(traitTitle + '-' + geneTitle)}`}>
                                                                <a className={`morph-indicator morph-${type}-${this.pipes.toUrl(traitTitle)}`}>
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
                                                <h3 className="title">Локалитет:</h3>
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
                                <li className="product-card-info-item">
                                    <h3 className="title">Дата рождения:</h3>
                                    <h3 className="info info-text">{formatDate(new Date(cb), 'DD/MM/YYYY', 'ru')}</h3>
                                </li>
                                <li className="product-card-info-item">
                                    <h3 className="title">Возраст:</h3>
                                    <h3 className="info info-text">{age.title}</h3>
                                </li>
                                {
                                    guards.length > 0 ?
                                        (
                                            <li className="product-card-info-item align-items-sm-center flex-sm-row">
                                                <h3 className="title">Рейтинг у хранителей:</h3>
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
                                <li className="product-card-info-item shop flex-column">
                                    <div className="shop-title mt-0 d-flex">
                                        <h3 className="title">Производитель:</h3>
                                        <Link href="/shops/[shopName]" as={'/shops/' + company_name}>
                                            <a>
                                                <h3 className="info info-text">{company_name}</h3>
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
                                    <h3 className="title">Локация:</h3>
                                    <h3 className="info info-text">{location}</h3>
                                    <div className={`country-flag flag flag-${country?.iso_3166_2.toLowerCase()}`}></div>
                                </li>
                            </ul>
                        </div>

                        <div className="in-cart-container feather-shadow">
                            <div className="price-container d-flex justify-content-center align-items-center">
                                <h2 className="price">{price}</h2>
                                <FontAwesomeIcon icon={faRubleSign} size="2x" className="ruble-icon"/>
                            </div>
                            <div className="btn-main btn-in-cart m-0" onClick={() => this.sendMessage()}>
                                <h3>Написать о покупке</h3>
                            </div>
                            {/*<div className="btn-second-bn btn-in-cart feather-shadow">*/}
                            {/*    <h3>Забронировать</h3>*/}
                            {/*</div>*/}
                        </div>
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
