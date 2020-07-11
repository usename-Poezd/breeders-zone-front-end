import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LazyImg from "../lazy-img";
import Linkify from "react-linkify";
import React from "react";
import {withRouter} from "next/router";
import {connect} from "react-redux";

const ChatBabble = (props) => {
    const {product} = props.message;
    return (
        <div className="chat-bubble-wrap">
            <div
                className="chat-bubble"
                style={
                    props.message.id === 1 ?
                        {
                            'backgroundColor': 'rgb(204, 204, 204)',
                            'float': 'left'
                        }
                        : null
                }
            >
                {
                    !props.message.messageId ?
                        (
                            <div className="message-status">
                                <FontAwesomeIcon icon={faClock} size="lg"/>
                            </div>
                        )
                        : null
                }
                {
                    !props.message.checked  && props.message.messageId ?
                        (
                            <div className="message-status">
                                <FontAwesomeIcon icon={faCircle} size="lg"/>
                            </div>
                        )
                        : null
                }
                {
                    product ?
                        <div className={"chat-divider" + (props.message.id === 1 ? ' left' : ' right')}>
                            <div
                                className={"chat-bubble-product" + (props.message.id === 1 ? ' align-items-start' : ' align-items-end')}
                            >
                                <Link href={"/reptiles/[id]"} as={"/reptiles/" + product.id}>
                                    <a className="title">
                                        {product.name}
                                    </a>
                                </Link>
                                <Link href={"/reptiles/[id]"} as={"/reptiles/" + product.id}>
                                    <p className="product-img">
                                        {
                                            product.product_images.length > 0 ?
                                                <LazyImg src={product.product_images[0].img_src} className="img-fluid"/>
                                                : null
                                        }
                                    </p>
                                </Link>
                            </div>
                        </div>
                        : null
                }
                <Linkify>
                    <p className={props.message.id === 1 ? 'text-left' : 'text-right'}>{props.message.message}</p>
                </Linkify>
            </div>
        </div>
    )
};

export default withRouter(ChatBabble);