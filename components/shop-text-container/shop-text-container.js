import React from 'react';

const ShopTextContainer = ({text, title}) => {

    if(text === '' || text === null) return null;

    return (
        <React.Fragment>
            <h2 className="shop-title">{title}:</h2>
            <div className="shop-container">
                <p>
                    {text}
                </p>
            </div>
        </React.Fragment>
    );
}

export default ShopTextContainer;