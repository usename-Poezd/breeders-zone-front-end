import React, { Component } from 'react';
import {Row, Col, Button, Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenus, faRubleSign, faMars } from '@fortawesome/free-solid-svg-icons';
import { Link, withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { Pipes } from '../../../services';
import { withGetData, withErrorBoundry } from '../../hoc-helpers';
import kinds from "../../../reducers/kinds";
import {formatDate} from "react-day-picker/moment";
import Spinner from "../../spinner";
import Chat from "../../chat";
import Carousel, {ModalGateway, Modal as ImageModal} from "react-images";

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

    componentDidMount(){
        const { id } = this.props.match.params;
        this.upgradeProduct(id);
    }

    upgradeProduct = (id) => {
        const { getProduct } = this.props;

        this.setState({productRequest: true});
        getProduct(id)
            .then(data => this.setState({
                product: data,
                productRequest: false,
                mainImg: data.product_images[0]
            }));
    };

    sendMessage = () => {
        this.props.history.push('?act=new');
        this.setState({sendMessageModal: true});
    };

    modalClose = () => {
        this.props.history.push(this.props.match.url + '');
        this.setState({sendMessageModal: false});
    };

    render(){
        const {product, productRequest, sendMessageModal, mainImg, modalImage} = this.state;
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
        } = product;

        const sliderOptions = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
        };

        const {kind} = this.props.match.params;

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
                        <Chat newUser={this.state.product.user}/>
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
                                subcategory.title ?
                                    (
                                        <li className="product-card-info-item">
                                            <h3 className="title">Подкатегория:</h3>
                                            <Link to={`../${kind}/subcategories/${this.pipes.toUrl(subcategory.title)}`} className="subcategory-title">
                                                <h3 className="info info-text">{subcategory.title}</h3>
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
                                                        <Link to={`./traits/${this.pipes.toUrl(traitTitle + '-' + geneTitle)}`} className={`morph-indicator morph-${type}-${this.pipes.toUrl(traitTitle)}`}>
                                                            {traitTitle} {geneTitle}
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
                                                        <Link to={`../${kind}?locality=${locality.id}`} className="morph-indicator morph-other-normal">
                                                            {locality.title}
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
                                    <Link to={'/shops/' + this.pipes.toUrl(company_name)} >
                                        <h3 className="info info-text">{company_name}</h3>
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
        );
    }
}

const mapMethodsToProps = ({getProduct}) => ({
    getProduct
});

export default withGetData(withErrorBoundry(ProductPage), mapMethodsToProps);
