import * as React from "react";
import {FC} from 'react';
import { Col } from 'react-bootstrap';
import Skeleton from "react-loading-skeleton";

const ProductListItemSkeleton: FC = () => {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="item">
            <div className="list-item">
                <div className="profile">
                    <Skeleton width={40} height={40} circle/>
                    <div className="profile-info">
                        <h3> <Skeleton/></h3>
                    </div>
                </div>
                <div className="item-body">
                    <div className="item-img">
                        <Skeleton style={{borderRadius: 0}}/>
                    </div>
                    <div className="item-info">
                        <h3 className="item-title h3">
                            <Skeleton/>
                        </h3>
                        <div className="item-info-container d-flex justify-content-between align-items-center">
                            <div className="cb-and-raiting">
                                <div className="cb">
                                    <div className="sex">
                                        <div>
                                            <Skeleton width={40}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="rating"></div>
                            </div>
                            <span className="price">
                                <Skeleton width={70}/>
                            </span>

                        </div>
                    </div>
                    <div className="btn-in-cart-container">
                        <h3><Skeleton className="btn"/></h3>
                    </div>
                </div>
            </div>
        </Col>
    );
};

export {
    ProductListItemSkeleton
}
