import React from "react";

const Spinner = ({size = null}) => {
    return (
        <div className="spinner-boxes-container py-3">
            <div
                className={"spinner-boxes" + (size ? ` size-${size}` : '')}
            >
                <div className="box">
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                </div>
                <div className="box">
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                </div>
                <div className="box">
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                </div>
                <div className="box">
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                    <div className="box-item"></div>
                </div>
            </div>
        </div>
    )
};

export default Spinner;
