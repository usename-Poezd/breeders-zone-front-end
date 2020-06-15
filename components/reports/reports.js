import React from "react";
import {connect} from "react-redux";
import {Alert} from "react-bootstrap";
import LazyImg from "../lazy-img";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {deleteDivorceReport, deleteProductReport} from "../../actions";

const Reports = (props) => {
    const {reports} = props;

    const close = (id) => {
        const {isProduct = false, deleteProductReport, deleteDivorceReport} = props;
        if (isProduct)
            deleteProductReport(id);
        else
            deleteDivorceReport(id);
    };

    if (reports.length === 0) {
        return null;
    }

    return (
        <div>
            <h1 className="text-center my-3">Жалобы: </h1>
            {
                reports.map( (item) => (
                    <Alert variant="danger" key={item.id}>
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="m-0">Причина: {item.title}</h3>
                            <span
                                onClick={() => close(item.id)}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg"/>
                            </span>
                        </div>
                        <hr className="my-2"/>
                        <p>Подробнее: {item.description}</p>
                        <div className="d-flex justify-content-end">
                            <div className="profile">
                                <div className="profile-img">
                                    {
                                        item._guard.profile_img ?
                                            <LazyImg
                                                src={item._guard.profile_img}
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
                                    <p>{item._guard.name} {item._guard.surname}</p>
                                </div>
                            </div>
                        </div>
                    </Alert>
                ))
            }
        </div>
    )
};

export default connect(null, {deleteProductReport, deleteDivorceReport})(Reports);