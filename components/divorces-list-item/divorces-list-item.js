import Link from "next/link";
import LazyImg from "../lazy-img";
import {Col} from "react-bootstrap";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck} from "@fortawesome/free-solid-svg-icons";
import {setReportModalDivorceId, setReportModalShow} from "../../redux/actions";
import {withDataService} from "../../HOC";
import {connect} from "react-redux";
import moment from "moment";

const DivorcesListItem = (props) => {
    const [isVerify, setVerify] = useState(props.verified);
    const {profile, verifyDivorce, setReportModalDivorceId, setReportModalShow} = props;
    return (
        <Col xs={12} sm={6} ms={4} lg={3} className="item">
            <div className="list-item">
                <Link href="/shops/[shopName]" as={'/shops/' + props.user.company_name} >
                    <a className="profile">
                        <div className="profile-img">
                            {
                                props.user.logo_img_url ?
                                    <LazyImg
                                        src={props.user.logo_img_url}
                                        alt="asd"
                                        className="img-fluid"
                                    />
                                    : <LazyImg
                                        src={'/images/icons/error-snake.svg'}
                                        alt="asd"
                                        className="img-fluid"
                                    />
                            }
                        </div>
                        <div className="profile-info">
                            <h3>{props.user.company_name}</h3>
                        </div>
                        {
                            isVerify ?
                                <div className="rate-block ml-auto" style={{top: 0}}>
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
                                <div className="rate-block ml-auto" style={{top: 0}}>
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
                    </a>
                </Link>
                <div className="item-body">
                    <Link href="/divorces/[id]" as={`/divorces/${props.id}`}>
                        <a className="item-img divorce-img">
                            {
                                props.exit_photos[0] ?
                                    <LazyImg
                                        src={props.exit_photos[0].img_src}
                                        alt="asd"
                                        className="img-fluid item-img"
                                    />
                                    : <LazyImg
                                        src={'/images/icons/error-snake.svg'}
                                        alt="asd"
                                        className="img-fluid item-img"
                                    />

                            }
                        </a>
                    </Link>
                    <div className="item-info">
                        <Link href="/divorces/[id]" as={`/divorces/${props.id}`}>
                            <a className="item-title h3">
                                {props.title}
                            </a>
                        </Link>
                        <div className="item-info-container d-flex flex-column align-items-center">
                            <p>{props.kind.title_rus}</p>
                            <p>{moment(props.cb).format('DD.MM.YYYY')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    );
};

const mapMethodsToProps = ({verifyDivorce}) => ({
    verifyDivorce
});

const mapStateToProps = ({profile}) => ({
    profile
});

export default connect(mapStateToProps, {setReportModalDivorceId, setReportModalShow})(
    withDataService(DivorcesListItem, mapMethodsToProps)
);
