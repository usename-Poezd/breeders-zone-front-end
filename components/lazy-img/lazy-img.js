import React from "react";

const LazyImg = ({ src, ...other }) => {
    other.className += ' lazyload';

    return <img data-src={src} {...other}/>;
};

export default LazyImg;