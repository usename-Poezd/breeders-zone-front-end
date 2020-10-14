import {Col, Container, Row} from "react-bootstrap";
import {DataService, Pipes} from "../../services";
import Head from "next/head";
import ReportModal from "../../components/report-modal/report-modal";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck} from "@fortawesome/free-solid-svg-icons";
import Carousel, {Modal as ImageModal, ModalGateway} from "react-images";
import {setReportModalDivorceId, setReportModalShow} from "../../actions";
import {connect} from "react-redux";
import {withGetData} from "../../components/hoc-helpers";
import Link from "next/link";
import {formatDate} from "react-day-picker/moment";
import LazyImg from "../../components/lazy-img";
import Slider from "react-slick";
import {compareMorph} from "../../utils";

const DivorcePage = (props) => {
    const {
        divorce,
        profile,
        verifyDivorce,
        setReportModalDivorceId,
        setReportModalShow
    } = props;
    const pipes = new Pipes();
    const sliderOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
    };

    const [isVerify, setVerify] = useState(divorce.verified);
    const [mainImg, setMainImg] = useState({
        img_src: ''
    });
    const [modalImage, setModalImage] = useState(false);
    const images = [
        ...divorce.sex_photos.map((item) => ({
            caption: `${divorce.title} | Фото спаривания`,
            source: item.img_src
        })),
        ...divorce.masonry_photos.map((item) => ({
            caption: `${divorce.title} | Фото кладки`,
            source: item.img_src
        })),
        ...divorce.exit_photos.map((item) => ({
            caption: `${divorce.title} | Фото выхода`,
            source: item.img_src
        }))
    ];

    return (
        <Container>
            <Head>
                <title>{divorce.title} | Breeders Zone</title>
                <meta name="description" content="История разведений | Breeders Zone"/>
            </Head>
            <Row className="product-card" style={{marginTop: 20}}>

                <ReportModal/>
                <ModalGateway>
                    {
                        modalImage ?
                            (
                                <ImageModal onClose={() => setModalImage(false)}>
                                    <Carousel views={images} currentIndex={images.findIndex((item) => item.source === mainImg.img_src)}/>
                                </ImageModal>
                            )
                            : null
                    }
                </ModalGateway>
                <Col xs={12} className="text-center position-relative">
                    <h2 className="product-card-title"><span className="morph">{divorce.title}</span></h2>

                    {
                        isVerify ?
                            <div
                                className="rate-block ml-auto"
                                 style={{
                                     position: 'absolute',
                                     left: 'auto',
                                     right: 20
                                 }}
                            >
                                <div
                                    className="check active"
                                    style={{
                                        margin:0
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck} size="lg"/>
                                </div>
                            </div>
                            : null
                    }
                    {
                        profile.user.is_guard && profile.user.guardians_kinds.find((item) => item.id === props.kind_id) && !isVerify ?
                            <div className="rate-block ml-auto"
                                 style={{
                                     position: 'absolute',
                                     left: 'auto',
                                     right: 20
                                 }}>
                                <div
                                    className={"check" + (isVerify ? ' active' : '')}
                                    style={{
                                        margin:0
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!isVerify) {
                                            setVerify(true);
                                            verifyDivorce(props.id)
                                        }
                                    }}>
                                    <FontAwesomeIcon icon={faCheck} size="lg"/>
                                </div>
                                {
                                    !isVerify  ?
                                        <div
                                            className="report text-danger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setReportModalDivorceId(props.id);
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
                <Col xs={12} className="product-card-container">
                    <div className="product-card-body feather-shadow">
                        <Row className="product-card-info">
                            <Col xs={12} md={6} className="product-card-info-item">
                                <h3 className="title">Категория:</h3>
                                <h3 className="info info-text">
                                    {divorce.kind.title_rus}<br/>
                                    ({divorce.kind.title_eng})
                                </h3>
                            </Col>
                            {
                                divorce.subcategory !== null ?
                                    (
                                        <Col xs={12} md={6} className="product-card-info-item">
                                            <h3 className="title">Подкатегория:</h3>
                                            <Link href="/[group]/[kind]/subcategories/[subcategoryTitle]" as={`/${pipes.toUrl(divorce.kind.group)}/${pipes.toUrl(divorce.kind.title_eng)}/subcategories/${pipes.toUrl(divorce.subcategory.title)}`}>
                                                <a className="subcategory-title">
                                                    <h3 className="info info-text">{divorce.subcategory.title}</h3>
                                                </a>
                                            </Link>
                                        </Col>
                                    )
                                    : null
                            }
                            <Col xs={12} md={6} className="product-card-info-item">
                                <h3 className="title">Дата выхода:</h3>
                                <h3 className="info info-text">{formatDate(new Date(divorce.cb), 'DD/MM/YYYY', 'ru')}</h3>
                            </Col>
                            <Col xs={12} md={6} className="product-card-info-item shop flex-column">
                                <div className="shop-title mt-0 d-flex">
                                    <h3 className="title">Производитель:</h3>
                                    <Link href="/shops/[shopName]" as={'/shops/' + pipes.toUrl(divorce.user.company_name)}>
                                        <a>
                                            <h3 className="info info-text">{divorce.user.company_name}</h3>
                                        </a>
                                    </Link>
                                </div>
                            </Col>
                            {
                                divorce.male.length > 0 ?
                                    (
                                        <Col xs={12} className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title title-sex">Самец:</h3>
                                            <div className="info morphs">
                                                {
                                                    divorce.male.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle}}) => (
                                                        <Link href="/[group]/[kind]/morphs/[morph]" as={`/${pipes.toUrl(divorce.kind.group + '/' + divorce.kind.title_eng)}/morphs/${pipes.toUrl(traitTitle + '-' + geneTitle)}`}>
                                                            <a className={`morph-indicator morph-${type}-${pipes.toUrl(traitTitle)}`}>
                                                                {compareMorph(traitTitle, geneTitle)}
                                                            </a>
                                                        </Link>
                                                    ))
                                                }
                                            </div>
                                        </Col>
                                    )
                                    : null
                            }
                            {
                                divorce.female.length > 0 ?
                                    (
                                        <Col xs={12} className="product-card-info-item flex-row align-items-center">
                                            <h3 className="title title-sex">Самка:</h3>
                                            <div className="info morphs">
                                                {
                                                    divorce.female.map( ({gene: {title: geneTitle, type}, trait: {title: traitTitle}}) => (
                                                        <Link href="/[group]/[kind]/morphs/[morph]" as={`/${pipes.toUrl(divorce.kind.group + '/' + divorce.kind.title_eng)}/morphs/${pipes.toUrl(traitTitle + '-' + geneTitle)}`}>
                                                            <a className={`morph-indicator morph-${type}-${pipes.toUrl(traitTitle)}`}>
                                                                {compareMorph(traitTitle, geneTitle)}
                                                            </a>
                                                        </Link>
                                                    ))
                                                }
                                            </div>
                                        </Col>
                                    )
                                    : null
                            }
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                {
                    divorce.sex_photos.length > 0 ?
                        <Col xs={12}>
                            <h1 className="text-center" style={{marginBottom: 20}}>Фото спаривания:</h1>
                            <div className="product-card-body feather-shadow">
                                <div className="product-card-img m-0">
                                    <Slider {...sliderOptions}>
                                        {
                                            divorce.sex_photos.map( (item) => (
                                                <div
                                                    onClick={() => {
                                                        setMainImg(item);
                                                        setModalImage(true);
                                                    }}
                                                    className={"slider-item" + (item.id === mainImg.id ? ' selected' : '')}
                                                >
                                                    <LazyImg src={item.img_src} className="img-fluid" alt="main"/>
                                                </div>
                                            ))
                                        }
                                    </Slider>
                                </div>
                            </div>
                        </Col>
                        : null
                }
                {
                    divorce.masonry_photos.length > 0 ?
                        <Col xs={12}>
                            <h1 className="text-center" style={{marginBottom: 20}}>Фото кладки:</h1>
                            <div className="product-card-body feather-shadow">
                                <div className="product-card-img m-0">
                                    <Slider {...sliderOptions}>
                                        {
                                            divorce.masonry_photos.map( (item) => (
                                                <div
                                                    onClick={() => {
                                                        setMainImg(item);
                                                        setModalImage(true);
                                                    }}
                                                    className={"slider-item" + (item.id === mainImg.id ? ' selected' : '')}
                                                >
                                                    <LazyImg src={item.img_src} className="img-fluid" alt="main"/>
                                                </div>
                                            ))
                                        }
                                    </Slider>
                                </div>
                            </div>
                        </Col>
                        : null
                }
                {
                    divorce.exit_photos.length > 0 ?
                        <Col xs={12}>
                            <h1 className="text-center" style={{marginBottom: 20}}>Фото выхода:</h1>
                            <div className="product-card-body feather-shadow">
                                <div className="product-card-img m-0">
                                    <Slider {...sliderOptions}>
                                        {
                                            divorce.exit_photos.map( (item) => (
                                                <div
                                                    onClick={() => {
                                                        setMainImg(item);
                                                        setModalImage(true);
                                                    }}
                                                    className={"slider-item" + (item.id === mainImg.id ? ' selected' : '')}
                                                >
                                                    <LazyImg src={item.img_src} className="img-fluid" alt="main"/>
                                                </div>
                                            ))
                                        }
                                    </Slider>
                                </div>
                            </div>
                        </Col>
                        : null
                }
            </Row>
        </Container>
    )
};

const mapMethodsToProps = ({verifyDivorce}) => ({
    verifyDivorce
});

const mapStateToProps = ({profile}) => ({
    profile
});

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const divorce = await dataService.getDivorce(ctx.query.id);

    return {
        props: {
            divorce
        }
    }
};



export default connect(mapStateToProps, {setReportModalDivorceId, setReportModalShow})(
    withGetData(DivorcePage, mapMethodsToProps)
);
