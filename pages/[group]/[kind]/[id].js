import React, {Component} from "react";
import {DataService, Pipes} from "../../../services";
import {Col, Container, Modal, Row} from "react-bootstrap";
import Spinner from "../../../components/spinner";
import Carousel, {Modal as ImageModal, ModalGateway} from "react-images";
import Chat from "../../../components/chat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faRubleSign, faVenus} from "@fortawesome/free-solid-svg-icons";
import {formatDate} from "react-day-picker/moment";
import Slider from "react-slick";
import {withErrorBoundry, withGetData} from "../../../components/hoc-helpers";
import {withRouter} from "next/router";
import Link from "next/link";
import {connect} from "react-redux";
import Head from "next/head";

class ProductPage extends Component  {

    state = {
        product: {
            user: {
                company_name: '',
                location: '',
                logo_img_url: ''
            },
            morphs: [],
            kind: {
                title_eng: '',
                title_rus: ''
            },
            localities: [],
            product_images: [],
            subcategory: {
                title: ''
            },
            age: {
                title: ''
            }
        },
        productRequest: false,
        sendMessageModal: false,
        mainImg: null,
        modalImage: false
    };
    pipes = new Pipes();

    componentWillMount(){
        this.setState({mainImg: this.props.product.product_images[0]});
    }

    // upgradeProduct = (id) => {
    //     const { getProduct } = this.props;
    //
    //     this.setState({productRequest: true});
    //     getProduct(id)
    //         .then(data => this.setState({
    //             product: data,
    //             productRequest: false,
    //             mainImg: data.product_images[0]
    //         }));
    // };

    sendMessage = (user) => {
        const { router, pathname, search } = this.props;

        this.setState({
            sendMessageModal: true
        });
        router.push(router.pathname, pathname + (search ? search + '&act=new' : '?act=new'));
    };

    modalClose = () => {
        const { router, pathname, search } = this.props;
        const newQuery = qs.parse(search.replace('?', ''));
        if (newQuery.act)
            delete newQuery.act;
        if (newQuery.room)
            delete newQuery.room;
        router.push(router.pathname, pathname + (qs.stringify(newQuery) ? '?' + qs.stringify(newQuery) : ''));
        this.setState({sendMessageModal: false});
    };

    render(){
        const { productRequest, sendMessageModal, mainImg, modalImage} = this.state;
        const {
            name,
            price,
            sex,
            cb,
            morphs,
            user: {
                company_name,
                location,
                logo_img_url
            },
            age,
            kind: {title_rus, title_eng},
            localities,
            description,
            product_images,
            subcategory
        } = this.props.product;

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


                    <Col xs={12} className=" text-center">
                        <h2 className="product-card-title"><span className="morph">{name}</span></h2>
                    </Col>
                    <Col xs={12} lg={6} className="product-card-container">
                        <div className="product-card-body feather-shadow">
                            <ul className="product-card-info">
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
                                                        morphs.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle}}) => (
                                                            <Link href="/[group]/[kind]/genes/[morph]" as={`/${group}/${kind}/genes/${this.pipes.toUrl(traitTitle + '-' + geneTitle)}`}>
                                                                <a className={`morph-indicator morph-${type}-${this.pipes.toUrl(traitTitle)}`}>
                                                                    {traitTitle} {geneTitle}
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
                                    localities.length > 0 ?
                                        (
                                            <li className="product-card-info-item">
                                                <h3 className="title">Локалитеты:</h3>
                                                <div className="info morphs">
                                                    {
                                                        localities.map( (locality) => (
                                                            <Link href="/[grou]/[kind]" as={`/${group}/${kind}?locality=${locality.id}`} >
                                                                <a className="morph-indicator morph-other-normal">
                                                                    {locality.title}
                                                                </a>
                                                            </Link>
                                                        ))
                                                    }
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
                                <li className="product-card-info-item align-items-sm-center flex-sm-row">
                                    <h3 className="title">Рейтинг у ведущих террариумистов:</h3>
                                    <div className="info rate d-flex align-items-center">
                                        <div className="rating">
                                            <div className="rating-star"></div>
                                            <div className="rating-star"></div>
                                            <div className="rating-star"></div>
                                            <div className="rating-star"></div>
                                            <div className="rating-star"></div>
                                        </div>
                                        <span className="rating-count">(5/5)</span>
                                    </div>
                                </li>
                                <li className="product-card-info-item shop flex-column">
                                    <div className="shop-title d-flex">
                                        <h3 className="title">Производитель:</h3>
                                        <Link href="/shops/[shopName]" as={'/shops/' + this.pipes.toUrl(company_name)}>
                                            <a>
                                                <h3 className="info info-text">{company_name}</h3>
                                            </a>
                                        </Link>
                                    </div>
                                    {
                                        logo_img_url ?
                                            (
                                                <div className="shop-img text-center">
                                                    <img src={logo_img_url} className="img-fluid"/>
                                                </div>
                                            )
                                            : null
                                    }
                                </li>
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title">Локация:</h3>
                                    <h3 className="info info-text">{location}</h3>
                                    <div className="country-flag country-flag-russia"></div>
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
                                            <img src={mainImg.img_src} className="img-fluid img-main" alt="main"/>
                                        </div>
                                    )
                                    : null
                            }
                            <Slider {...sliderOptions}>
                                {
                                    product_images.map( (item) => (
                                        <div
                                            onClick={() => this.setState({mainImg: item})}
                                            className={"slider-item" + (item.id === mainImg.id ? ' selected' : '')}
                                        >
                                            <img src={item.img_src} className="img-fluid" alt="main"/>
                                        </div>
                                    ))
                                }
                            </Slider>
                        </div>

                        <div className="product-card-description feather-shadow">
                            <p>
                                <span className="desc">Описание:</span> {description}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const product = await dataService.getProduct(ctx.query.id);

    return {
        props: {
            product
        }
    }
};


const mapStateToProps = ({router: {location: {pathname, search}}}) => ({
    pathname,
    search
});


export default connect(mapStateToProps)(
    withRouter(
            withErrorBoundry(ProductPage)
    )
);