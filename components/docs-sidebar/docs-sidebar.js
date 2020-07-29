import React from "react";
import {withRouter} from "next/router";
import Link from "next/link";

const DocsSidebar = (props) => {
    const {documents = [], router, paddingTop = 0} = props;

    return (
        <div className={`sidebar border-right pt--${paddingTop}`}>
            {
                documents.map((item) => (
                    <div
                        key={item.label}
                        className={`sidebar-item ${router.query.label === item.label ? ' active' : ''}`}
                    >
                        <Link href="/documents/[label]" as={`/documents/${item.label}`}>
                            <a>{item.title}</a>
                        </Link>
                    </div>
                ))
            }
        </div>
    )
};

export default withRouter(DocsSidebar);
