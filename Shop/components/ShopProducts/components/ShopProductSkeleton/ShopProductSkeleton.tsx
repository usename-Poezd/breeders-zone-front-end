import * as React from "react";
import {FC} from "react";
import Skeleton from 'react-loading-skeleton';

const ShopProductSkeletonComponent: FC = () => {
    return (
        <div className="products-item feather-shadow d-flex">
            <div className="products-item-img">
                <Skeleton height={100}/>
            </div>
            <div className="products-item-info">
                <h1 className="font-weight-bold"><Skeleton /></h1>
                <div className="w--50">
                    <Skeleton count={4}/>
                </div>
            </div>
            <div className="products-item-controls-container d-flex flex-column flex-md-row flex-md-column justify-content-center align-items-center">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3><Skeleton height={25} width={70}/></h3>
                </div>
                <div className="products-item-controls d-flex align-items-start justify-content-center">
                    <div className="mr--10">
                        <Skeleton height={30} width={30}/>
                    </div>
                    <div>
                        <Skeleton height={30} width={30}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

const ShopProductSkeleton = ShopProductSkeletonComponent;

export {
    ShopProductSkeleton
}
