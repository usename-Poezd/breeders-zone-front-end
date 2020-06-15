import React from "react";

const LazyImg = ({ src, className, ...other }) => {
    return <img className={"lazyload" + (className ? ` ${className}` : null)} data-src={src} {...other}/>;
};

export default LazyImg;