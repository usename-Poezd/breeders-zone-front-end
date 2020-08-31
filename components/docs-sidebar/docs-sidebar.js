import React from "react";
import {withRouter} from "next/router";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

const DocsSidebar = (props) => {
    const {documents = [], router} = props;

    return (
        <div className={`sidebar document-sidebar border-right`}>
            {
                documents.map((item) => (
                    <div
                        key={item.label}
                        className={`sidebar-item ${router.query.label === item.label ? ' active' : ''}`}
                    >
                        <a href={`/documents/${item.label}`} className="d-flex justify-content-between align-items-center d-md-block">
                            <span>{item.title}</span>
                            <span className="d-block d-md-none">
                                <FontAwesomeIcon icon={faArrowRight} size="sm" className="color-main"/>
                            </span>
                        </a>
                    </div>
                ))
            }
        </div>
    )
};

export default withRouter(DocsSidebar);
